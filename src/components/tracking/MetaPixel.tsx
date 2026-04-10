/**
 * MetaPixel — Facebook/Meta Pixel browser tracking
 * --------------------------------------------------
 * Client component that injects the Meta Pixel base code and fires a
 * PageView on mount. Loaded once in the public layout.
 *
 * The Pixel ID is read from `NEXT_PUBLIC_META_PIXEL_ID` — if it's not
 * set, the component renders nothing (safe for dev / preview).
 *
 * Deduplication:
 *  - Each event fired from the browser should carry a unique `event_id`.
 *  - The same `event_id` must be passed when the server fires the twin
 *    event via Conversions API (see `src/lib/meta-capi.ts`).
 *  - Meta dedupes by `event_name + event_id` within 24h.
 *
 * For event-specific tracking (ViewContent, AddToCart, InitiateCheckout,
 * Purchase), call the client helpers exported below from your components
 * — e.g. `trackViewContent(product)` inside a `useEffect` on PDP.
 */
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Augment window with fbq — populated by the Pixel script after load.
declare global {
  interface Window {
    fbq?: (
      action: 'init' | 'track' | 'trackCustom' | 'consent' | 'set',
      ...args: unknown[]
    ) => void;
    _fbq?: unknown;
  }
}

export function MetaPixel(): React.ReactElement | null {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    // Fire PageView once fbq is ready. The Pixel base code already fires
    // PageView on init, but this ensures SPA navigations also track.
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'PageView');
      } catch (err) {
        // Silent — Pixel is "best effort".
      }
    }
  }, []);

  if (!pixelId) {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '[BISOU] NEXT_PUBLIC_META_PIXEL_ID non défini — MetaPixel désactivé.',
      );
    }
    return null;
  }

  return (
    <>
      <Script
        id="bisou-meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Client helpers — call from components (use client)
// ─────────────────────────────────────────────────────────────

/**
 * Generate a random event_id (UUID v4) for dedup with server CAPI.
 * Store the returned id so you can reuse it on the server twin event.
 */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback RFC-4122 v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ViewContentParams = {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: 'product';
  value?: number;
  currency?: 'MAD';
  eventId?: string;
};

export function trackViewContent(params: ViewContentParams): string | null {
  const eventId = params.eventId ?? newEventId();
  if (typeof window === 'undefined' || !window.fbq) return eventId;
  try {
    window.fbq('track', 'ViewContent', {
      content_ids: params.content_ids,
      content_name: params.content_name,
      content_category: params.content_category,
      content_type: params.content_type ?? 'product',
      value: params.value,
      currency: params.currency ?? 'MAD',
    }, { eventID: eventId });
  } catch {
    /* noop */
  }
  return eventId;
}

type AddToCartParams = {
  content_ids: string[];
  content_name?: string;
  value: number;
  currency?: 'MAD';
  eventId?: string;
};

export function trackAddToCart(params: AddToCartParams): string | null {
  const eventId = params.eventId ?? newEventId();
  if (typeof window === 'undefined' || !window.fbq) return eventId;
  try {
    window.fbq('track', 'AddToCart', {
      content_ids: params.content_ids,
      content_name: params.content_name,
      content_type: 'product',
      value: params.value,
      currency: params.currency ?? 'MAD',
    }, { eventID: eventId });
  } catch {
    /* noop */
  }
  return eventId;
}

type InitiateCheckoutParams = {
  content_ids: string[];
  num_items?: number;
  value: number;
  currency?: 'MAD';
  eventId?: string;
};

export function trackInitiateCheckout(
  params: InitiateCheckoutParams,
): string | null {
  const eventId = params.eventId ?? newEventId();
  if (typeof window === 'undefined' || !window.fbq) return eventId;
  try {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: params.content_ids,
      num_items: params.num_items ?? 1,
      content_type: 'product',
      value: params.value,
      currency: params.currency ?? 'MAD',
    }, { eventID: eventId });
  } catch {
    /* noop */
  }
  return eventId;
}

type PurchaseParams = {
  content_ids: string[];
  value: number;
  currency?: 'MAD';
  num_items?: number;
  eventId?: string;
};

export function trackPurchase(params: PurchaseParams): string | null {
  const eventId = params.eventId ?? newEventId();
  if (typeof window === 'undefined' || !window.fbq) return eventId;
  try {
    window.fbq('track', 'Purchase', {
      content_ids: params.content_ids,
      content_type: 'product',
      value: params.value,
      currency: params.currency ?? 'MAD',
      num_items: params.num_items ?? 1,
    }, { eventID: eventId });
  } catch {
    /* noop */
  }
  return eventId;
}

export function trackLead(eventId?: string): string | null {
  const id = eventId ?? newEventId();
  if (typeof window === 'undefined' || !window.fbq) return id;
  try {
    window.fbq('track', 'Lead', {}, { eventID: id });
  } catch {
    /* noop */
  }
  return id;
}

export default MetaPixel;
