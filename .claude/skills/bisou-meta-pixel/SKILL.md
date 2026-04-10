---
name: bisou-meta-pixel
description: Meta Pixel (browser) + Conversions API (server) pour BISOU — tracking événements, dedup par event ID, mapping complet. Charge ce skill pour tout ce qui touche au tracking Meta.
when_to_use: Implémentation Pixel, CAPI, `/api/pixel/track`, debug events Manager, optimisation iOS 14+.
---

# BISOU — Meta Pixel + CAPI

## Architecture
- **Browser Pixel** (`components/tracking/MetaPixel.tsx`) — fbq('track', ...)
- **CAPI server** (`lib/meta-capi.ts`) — mirror côté serveur via `api/pixel/track`
- **Dedup** : `event_id` partagé entre browser et serveur → Meta dédoublonne

## Events mappés

| Event | Déclenchement | Données clés |
|---|---|---|
| `PageView` | Toutes les pages | url, referrer, user_agent |
| `ViewContent` | PDP `/produits/[slug]` | content_ids, content_name, value, currency=MAD |
| `AddToCart` | Clic "Ajouter" | content_ids, value |
| `InitiateCheckout` | Arrivée `/checkout` | value, num_items |
| `Purchase` | Soumission commande OK | value, currency, content_ids, order_id |
| `Lead` | Inscription newsletter | — |

## Pattern dedup
```tsx
// Browser
const eventId = crypto.randomUUID();
fbq('track', 'Purchase', { value, currency: 'MAD' }, { eventID: eventId });

// Server (même eventId)
await fetch('/api/pixel/track', {
  method: 'POST',
  body: JSON.stringify({ event: 'Purchase', eventId, data, userData }),
});
```

## CAPI Server (`lib/meta-capi.ts`)
```ts
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
const TOKEN = process.env.META_CAPI_ACCESS_TOKEN!;
const TEST = process.env.META_CAPI_TEST_EVENT_CODE;

export async function sendCAPIEvent(params: {
  event_name: string;
  event_id: string;
  event_time: number;
  user_data: { em?: string[]; ph?: string[]; fbc?: string; fbp?: string; client_ip_address?: string; client_user_agent?: string };
  custom_data: { value?: number; currency?: 'MAD'; content_ids?: string[]; content_name?: string; order_id?: string };
  event_source_url: string;
}) {
  const body = {
    data: [{ ...params, action_source: 'website' }],
    ...(TEST && { test_event_code: TEST }),
  };
  await fetch(`https://graph.facebook.com/v20.0/${PIXEL}/events?access_token=${TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
```

## Hash user data (PII)
Toutes les PII (email, téléphone) doivent être **hashées SHA256** avant envoi CAPI :
```ts
import { createHash } from 'node:crypto';
const hash = (v: string) => createHash('sha256').update(v.trim().toLowerCase()).digest('hex');
```

## FBC / FBP
- **`fbc`** : Facebook click ID — depuis URL param `?fbclid=...` → cookie `_fbc`
- **`fbp`** : Browser ID — cookie `_fbp` auto-généré par le Pixel
- À capturer côté client + transmettre au serveur dans le payload `/api/orders`
- Stocker dans `orders.metaFbc` + `orders.metaFbp` (champs hidden Payload)

## Consentement RGPD/CNDP
- Avant `Pixel.init()`, vérifier consentement utilisateur (bannière cookies)
- Si refus → ne pas charger le Pixel et ne pas envoyer CAPI
- Phase 1 : consent implicite OK (opt-out disponible). Phase 2 : consent explicite strict.

## Debug
- Events Manager → Test Events → entrer `META_CAPI_TEST_EVENT_CODE`
- Chrome Meta Pixel Helper extension
- Vérifier `dedup rate > 90%` dans Events Manager après 24h
