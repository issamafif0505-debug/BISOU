---
name: bisou-cod-whatsapp
description: Flow COD (contre-remboursement) de BISOU — création commande Payload, WhatsApp Cloud API, UpConfirm callback. Utilise dès que tu touches au checkout, à `src/lib/whatsapp.ts`, `src/app/api/orders/route.ts`, ou aux webhooks WhatsApp/UpConfirm.
when_to_use: Implémentation du tunnel checkout, envoi messages WhatsApp, webhooks entrants, intégration UpConfirm.
---

# BISOU — Flow COD + WhatsApp

## Vue d'ensemble
1. Client remplit `/checkout` → validation client (Zod)
2. `POST /api/orders` → création Payload + hook auto-génère `CMD-001`
3. Server déclenche en parallèle :
   - Ouverture WhatsApp côté client (deep link)
   - UpConfirm (confirmation IA automatisée)
   - Meta CAPI server-side (`InitiateCheckout` + `Purchase`)
4. Redirection `/merci/[orderId]`
5. Webhooks : UpConfirm met à jour `statut` (`confirmed|refused|no_answer`), WhatsApp gère les messages entrants

## Règle d'or WhatsApp
**`WA_PHONE_NUMBER` jamais hardcodé.** Uniquement dans `.env`, lu par `src/lib/whatsapp.ts` :

```ts
// src/lib/whatsapp.ts
export const WA_PHONE = process.env.WA_PHONE_NUMBER!;

export function buildWhatsAppUrl(order: OrderPayload): string {
  const text = `NOUVELLE COMMANDE BISOU
Produit : ${order.produit}
Prix : ${order.prix} MAD — PAIEMENT A LA LIVRAISON
Client : ${order.prenom} ${order.nom}
Tel : ${order.telephone}
Ville : ${order.ville}
Adresse : ${order.adresse}
Note : ${order.note || 'Aucune'}`;
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}
```

Tous les composants importent `buildWhatsAppUrl` depuis `@/lib/whatsapp`.
CI : `pnpm check-wa` bloque toute violation.

## Validation phone Maroc (Zod)
```ts
// src/lib/validation.ts
import { z } from 'zod';

export const phoneMASchema = z
  .string()
  .regex(/^(?:\+?212|0)[5-7]\d{8}$/, 'Numéro marocain invalide')
  .transform((v) => v.replace(/^(?:\+?212|0)/, '212'));

export const orderSchema = z.object({
  prenom: z.string().min(2).max(50),
  nom: z.string().min(2).max(50),
  telephone: phoneMASchema,
  ville: z.string(),
  adresse: z.string().min(10).max(300),
  produit: z.string(),
  prix: z.number().positive(),
  note: z.string().optional(),
});
```

## Hook Payload Orders
```ts
// Auto-génère CMD-001, CMD-002, etc.
beforeChange: [
  async ({ operation, data, req }) => {
    if (operation === 'create' && !data.orderId) {
      const last = await req.payload.find({
        collection: 'orders',
        sort: '-createdAt',
        limit: 1,
      });
      const n = last.docs[0]
        ? parseInt(last.docs[0].orderId.replace('CMD-', ''), 10) + 1
        : 1;
      data.orderId = `CMD-${String(n).padStart(3, '0')}`;
    }
    return data;
  },
]
```

## Cloud API WhatsApp
- **Endpoint :** `https://graph.facebook.com/v20.0/{WA_PHONE_NUMBER_ID}/messages`
- **Auth :** `Authorization: Bearer {WA_ACCESS_TOKEN}`
- **Templates à créer :** `cod_confirmation_fr`, `cod_tracking_fr`
- **Webhook :** `POST /api/webhooks/whatsapp` — signature vérifiée via `WA_APP_SECRET` (HMAC SHA256)
- **Verification GET :** retourne `hub.challenge` si `hub.verify_token === WA_WEBHOOK_VERIFY_TOKEN`

## UpConfirm
- **POST commande :** `lib/upconfirm.ts` — envoie `{orderId, phone, firstName, address, amount}` à l'API UpConfirm
- **Webhook :** `POST /api/webhooks/upconfirm` — signature `X-UpConfirm-Signature` vérifiée via `UPCONFIRM_WEBHOOK_SECRET`
- **Events :** `order.confirmed`, `order.refused`, `order.no_answer`
- **Action :** mise à jour Payload `orders.statut`

## Rate limiting
`POST /api/orders` → 10 req/min/IP (via Cloudflare WAF + vérif serveur).

## Sécurité
- Validation Zod côté serveur (miroir client)
- Vérification signatures webhooks (WhatsApp HMAC, UpConfirm custom header)
- Jamais de `WA_*` variables exposées au client (préfixe `NEXT_PUBLIC_` interdit pour WA)
