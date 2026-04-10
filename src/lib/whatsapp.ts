/**
 * WhatsApp — server-side helpers (SOLE SERVER READER of WA_PHONE_NUMBER)
 * ----------------------------------------------------------------------
 * This file is ONE OF TWO places in the entire codebase that is allowed
 * to reference the WhatsApp phone number. The other is
 * `src/lib/whatsapp-client.ts` (client-safe, reads NEXT_PUBLIC_WA_PHONE_NUMBER).
 *
 * The CI script `scripts/check-whatsapp-hardcoded.mjs` enforces this rule
 * by grepping for `wa.me/` and `212600000000` everywhere else under `src/`.
 *
 * If you need a WhatsApp URL in:
 *   - a server component / API route → import from `@/lib/whatsapp`
 *   - a client component ('use client') → import from `@/lib/whatsapp-client`
 *
 * NEVER hardcode a WhatsApp number anywhere else.
 */

import 'server-only';

const WA_PHONE = process.env.WA_PHONE_NUMBER;

if (!WA_PHONE) {
  // Don't throw — we still want the app to build in CI without secrets.
  // The warning surfaces loudly in server logs when a request hits
  // a WhatsApp-touching code path without the env var set.
  // eslint-disable-next-line no-console
  console.warn(
    '[BISOU] WA_PHONE_NUMBER missing in environment — WhatsApp links will be broken.',
  );
}

export type OrderForWhatsApp = {
  orderId: string;
  prenom: string;
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  produit: string;
  prix: number;
  note?: string;
};

const phoneOrFallback = (): string => WA_PHONE ?? '';

/**
 * Builds the pre-filled WhatsApp message for a new COD order.
 * Mirrors exactly the template used in `legacy/brand/checkout-cod.html`
 * so the incoming conversations look identical to the legacy HF Space.
 */
export function buildWhatsAppOrderMessage(order: OrderForWhatsApp): string {
  const note = order.note && order.note.trim() !== '' ? order.note : 'Aucune';
  return `🛍️ NOUVELLE COMMANDE BISOU

📦 Produit : ${order.produit}
💰 Prix : ${order.prix} MAD — PAIEMENT À LA LIVRAISON

👤 Client : ${order.prenom} ${order.nom}
📞 Téléphone : ${order.telephone}
📍 Ville : ${order.ville}
🏠 Adresse : ${order.adresse}
📝 Note : ${note}

✅ Commande confirmée (${order.orderId}) — En attente de validation BISOU`;
}

/**
 * Builds the full `https://wa.me/...` URL the client can open in a new tab
 * to fire off a COD order confirmation message.
 */
export function buildWhatsAppOrderUrl(order: OrderForWhatsApp): string {
  const text = buildWhatsAppOrderMessage(order);
  return `https://wa.me/${phoneOrFallback()}?text=${encodeURIComponent(text)}`;
}

/**
 * Pre-filled URL for the floating WhatsApp contact button (generic support).
 */
export function buildWhatsAppContactUrl(message?: string): string {
  const text =
    message || "Bonjour BISOU, j'aimerais en savoir plus sur vos bijoux ✨";
  return `https://wa.me/${phoneOrFallback()}?text=${encodeURIComponent(text)}`;
}

/**
 * WhatsApp URL for a product-specific enquiry (used from PDPs).
 */
export function buildWhatsAppProductQuestionUrl(
  productName: string,
  price: number,
): string {
  const text = `Bonjour BISOU, je suis intéressé(e) par "${productName}" (${price} MAD). Pouvez-vous me donner plus d'informations ?`;
  return `https://wa.me/${phoneOrFallback()}?text=${encodeURIComponent(text)}`;
}
