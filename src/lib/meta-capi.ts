/**
 * Meta Conversions API (server-side)
 * ------------------------------------
 * Twin-track every important browser Pixel event on the server so that:
 *   1. Ad-blockers and iOS privacy features can't hide conversions.
 *   2. Meta's dedup engine can match browser + server events via
 *      `event_name + event_id` and keep only one.
 *
 * Flow:
 *   - Browser fires Pixel event with a random `eventID` (see MetaPixel.tsx).
 *   - The same event_id is sent to the server (e.g. on form submit).
 *   - The server calls `sendCAPIEvent({ event_id, ... })` with hashed PII.
 *   - Meta dedupes → 1 conversion counted.
 *
 * PII hashing: email & phone are lowercased, trimmed, then SHA-256.
 * We never log raw PII.
 *
 * Failure mode: this module NEVER throws. CAPI is best-effort; a dead
 * network call must not break a checkout.
 */

import 'server-only';
import crypto from 'node:crypto';

const GRAPH_URL = 'https://graph.facebook.com/v18.0';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type CAPIEventName =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact';

export type CAPIUserData = {
  /** Hashed email(s). */
  em?: string[];
  /** Hashed phone(s) — E.164 digits only, no +. */
  ph?: string[];
  /** Hashed first name(s). */
  fn?: string[];
  /** Hashed last name(s). */
  ln?: string[];
  /** Hashed city. */
  ct?: string[];
  /** Hashed country (2 letters lowercase). */
  country?: string[];
  /** Facebook click ID from the `fbclid` URL param (plaintext, not hashed). */
  fbc?: string;
  /** Facebook browser ID from the `_fbp` cookie (plaintext). */
  fbp?: string;
  /** Visitor IP address. */
  client_ip_address?: string;
  /** Visitor User-Agent string. */
  client_user_agent?: string;
};

export type CAPICustomData = {
  currency?: 'MAD';
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  content_type?: 'product' | 'product_group';
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  order_id?: string;
  [key: string]: unknown;
};

export type CAPIEvent = {
  event_name: CAPIEventName;
  /** Unique ID — MUST match the browser Pixel `eventID` for dedup. */
  event_id: string;
  /** Unix seconds — defaults to now() if omitted. */
  event_time?: number;
  /** Canonical URL of the page that triggered the event. */
  event_source_url?: string;
  /** 'website' | 'email' | 'phone_call' | ... */
  action_source?: 'website' | 'email' | 'phone_call' | 'chat' | 'other';
  user_data: CAPIUserData;
  custom_data?: CAPICustomData;
};

// ─────────────────────────────────────────────────────────────
// Hashing
// ─────────────────────────────────────────────────────────────

/**
 * SHA-256 hash per Meta CAPI spec: lowercase + trim + no diacritics.
 */
export function hashPII(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalised = value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (!normalised) return undefined;
  return crypto.createHash('sha256').update(normalised).digest('hex');
}

/**
 * Normalise + hash a Moroccan phone number. Returns the SHA-256 of the
 * E.164 digits (e.g. `212600000000` → hash). Accepts `+212...`, `0...`,
 * `212...`, and strips non-digit characters.
 */
export function hashPhoneMA(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `212${digits.slice(1)}`;
  if (digits.startsWith('212') === false && digits.length === 9) {
    digits = `212${digits}`;
  }
  if (!digits) return undefined;
  return crypto.createHash('sha256').update(digits).digest('hex');
}

// ─────────────────────────────────────────────────────────────
// CAPI client
// ─────────────────────────────────────────────────────────────

type SendResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

/**
 * POST a single event to Meta Conversions API.
 * Returns `{ ok: true }` on success, logs + returns `{ ok: false }` on failure.
 * NEVER throws.
 */
export async function sendCAPIEvent(event: CAPIEvent): Promise<SendResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        '[BISOU CAPI] NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN missing — event skipped',
        { event_name: event.event_name, event_id: event.event_id },
      );
    }
    return { ok: false, error: 'not-configured' };
  }

  const payload = {
    data: [
      {
        event_name: event.event_name,
        event_id: event.event_id,
        event_time: event.event_time ?? Math.floor(Date.now() / 1000),
        event_source_url: event.event_source_url,
        action_source: event.action_source ?? 'website',
        user_data: event.user_data,
        custom_data: event.custom_data,
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const res = await fetch(
      `${GRAPH_URL}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Cache must stay off — CAPI is a stateful POST.
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.warn(
        `[BISOU CAPI] HTTP ${res.status} — event "${event.event_name}" failed`,
        { event_id: event.event_id, body: errBody.slice(0, 500) },
      );
      return { ok: false, status: res.status, error: errBody };
    }

    return { ok: true, status: res.status };
  } catch (err: any) {
    console.warn('[BISOU CAPI] Network error', {
      event_name: event.event_name,
      event_id: event.event_id,
      err: err?.message ?? String(err),
    });
    return { ok: false, error: err?.message ?? 'fetch-failed' };
  }
}

/**
 * Send multiple events in one request (up to 1000 per Meta's limit).
 * Useful for batch processing (e.g. sitemap crawls, migration scripts).
 */
export async function sendCAPIBatch(events: CAPIEvent[]): Promise<SendResult> {
  if (events.length === 0) return { ok: true };

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { ok: false, error: 'not-configured' };
  }

  const payload = {
    data: events.map((e) => ({
      event_name: e.event_name,
      event_id: e.event_id,
      event_time: e.event_time ?? Math.floor(Date.now() / 1000),
      event_source_url: e.event_source_url,
      action_source: e.action_source ?? 'website',
      user_data: e.user_data,
      custom_data: e.custom_data,
    })),
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const res = await fetch(
      `${GRAPH_URL}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    );
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      return { ok: false, status: res.status, error: errBody };
    }
    return { ok: true, status: res.status };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'fetch-failed' };
  }
}

// ─────────────────────────────────────────────────────────────
// Convenience helpers
// ─────────────────────────────────────────────────────────────

/**
 * Build a user_data object from request headers + optional PII.
 * Hashes email/phone automatically.
 */
export function buildUserData(input: {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  country?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
}): CAPIUserData {
  const userData: CAPIUserData = {};

  const em = hashPII(input.email ?? undefined);
  if (em) userData.em = [em];

  const ph = hashPhoneMA(input.phone ?? undefined);
  if (ph) userData.ph = [ph];

  const fn = hashPII(input.firstName ?? undefined);
  if (fn) userData.fn = [fn];

  const ln = hashPII(input.lastName ?? undefined);
  if (ln) userData.ln = [ln];

  const ct = hashPII(input.city ?? undefined);
  if (ct) userData.ct = [ct];

  const country = hashPII(input.country ?? 'ma');
  if (country) userData.country = [country];

  if (input.ip) userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  return userData;
}
