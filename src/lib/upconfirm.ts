/**
 * UpConfirm — COD order confirmation (AI-powered call bot)
 * ---------------------------------------------------------
 * Wraps the UpConfirm REST API. Two entrypoints:
 *   1. `submitOrderToUpConfirm(order)` — called fire-and-forget from
 *      /api/orders right after the Payload record is created.
 *   2. `verifyUpConfirmSignature(rawBody, signature)` — HMAC-SHA-256
 *      check for incoming webhooks on /api/webhooks/upconfirm.
 *
 * NOTE: the exact request/response shape of UpConfirm is not public.
 * Fields here are based on the plan (§10) and can be adjusted once we
 * read their production docs. All env vars are optional — missing
 * credentials degrade gracefully (log + no-op) so local dev keeps working.
 */

import 'server-only';

import crypto from 'node:crypto';

const UPCONFIRM_API_URL =
  process.env.UPCONFIRM_API_URL || 'https://api.upconfirm.com/v1';

export type UpConfirmOrderPayload = {
  orderId: string;
  customerName: string;
  phone: string;
  product: string;
  amount: number;
  city: string;
  address: string;
};

export type UpConfirmSubmitResult =
  | { ok: true; status: number }
  | { ok: false; reason: 'not_configured' | 'network_error' | 'http_error'; status?: number };

/**
 * Submits a freshly-created order to UpConfirm for agent callback.
 * Idempotent on `external_id` (UpConfirm dedupes on their side).
 */
export async function submitOrderToUpConfirm(
  order: UpConfirmOrderPayload,
): Promise<UpConfirmSubmitResult> {
  const apiKey = process.env.UPCONFIRM_API_KEY;
  const workspaceId = process.env.UPCONFIRM_WORKSPACE_ID;

  if (!apiKey || !workspaceId) {
    // eslint-disable-next-line no-console
    console.warn('[BISOU] UpConfirm not configured — skipping');
    return { ok: false, reason: 'not_configured' };
  }

  try {
    const res = await fetch(`${UPCONFIRM_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Workspace-Id': workspaceId,
      },
      body: JSON.stringify({
        external_id: order.orderId,
        customer: { name: order.customerName, phone: order.phone },
        product: {
          name: order.product,
          price: order.amount,
          currency: 'MAD',
        },
        shipping: { city: order.city, address: order.address },
        payment_method: 'cod',
      }),
      // Keep it snappy — this is fire-and-forget anyway.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `[BISOU] UpConfirm returned HTTP ${res.status} for ${order.orderId}`,
      );
      return { ok: false, reason: 'http_error', status: res.status };
    }

    return { ok: true, status: res.status };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[BISOU] UpConfirm submission failed', err);
    return { ok: false, reason: 'network_error' };
  }
}

/**
 * UpConfirm webhook status values (as described in the plan §10 and the
 * mapping to our Payload `statut` enum).
 */
export type UpConfirmStatus =
  | 'confirmed'
  | 'refused'
  | 'unreachable'
  | 'pending'
  | 'cancelled';

export type UpConfirmWebhookPayload = {
  external_id: string;
  status: UpConfirmStatus;
  reason?: string;
};

/**
 * Verifies an incoming UpConfirm webhook signature using HMAC-SHA-256.
 * Uses a constant-time comparison to avoid timing attacks.
 * Returns `false` on any missing secret / malformed signature.
 */
export function verifyUpConfirmSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.UPCONFIRM_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody);
    const computed = hmac.digest('hex');

    const computedBuf = Buffer.from(computed, 'utf8');
    const providedBuf = Buffer.from(signature, 'utf8');

    if (computedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, providedBuf);
  } catch {
    return false;
  }
}

/**
 * Maps an UpConfirm status to our Payload Orders `statut` enum.
 *   confirmed → 'confirmed'
 *   refused / cancelled → 'refused'
 *   unreachable / pending → null (don't touch the existing status)
 */
export function mapUpConfirmStatus(
  status: UpConfirmStatus,
): 'confirmed' | 'refused' | null {
  switch (status) {
    case 'confirmed':
      return 'confirmed';
    case 'refused':
    case 'cancelled':
      return 'refused';
    case 'unreachable':
    case 'pending':
    default:
      return null;
  }
}
