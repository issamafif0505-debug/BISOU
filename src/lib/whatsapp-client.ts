/**
 * WhatsApp — client-safe helpers (SOLE CLIENT READER of the phone number)
 * -----------------------------------------------------------------------
 * Mirror of `src/lib/whatsapp.ts` for use in client components ('use client').
 * Reads the public env variable `NEXT_PUBLIC_WA_PHONE_NUMBER` so the value
 * is inlined at build time and available in the browser bundle.
 *
 * Keep the public API identical to the server version so consumers can
 * refactor without thinking.
 *
 * NEVER hardcode a WhatsApp number anywhere else.
 */

const WA_PHONE = process.env.NEXT_PUBLIC_WA_PHONE_NUMBER ?? '';

if (typeof window !== 'undefined' && !WA_PHONE) {
  // eslint-disable-next-line no-console
  console.warn(
    '[BISOU] NEXT_PUBLIC_WA_PHONE_NUMBER missing — WhatsApp links will be broken.',
  );
}

export type OrderForWhatsAppClient = {
  orderId?: string;
  prenom: string;
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  produit: string;
  prix: number;
  note?: string;
};

/**
 * Builds the pre-filled WhatsApp message for a new COD order (client).
 * Kept in sync with `buildWhatsAppOrderMessage` on the server side.
 */
export function buildWhatsAppOrderMessage(order: OrderForWhatsAppClient): string {
  const note = order.note && order.note.trim() !== '' ? order.note : 'Aucune';
  const orderLine = order.orderId
    ? `✅ Commande confirmée (${order.orderId}) — En attente de validation BISOU`
    : '✅ Commande confirmée — En attente de validation BISOU';
  return `🛍️ NOUVELLE COMMANDE BISOU

📦 Produit : ${order.produit}
💰 Prix : ${order.prix} MAD — PAIEMENT À LA LIVRAISON

👤 Client : ${order.prenom} ${order.nom}
📞 Téléphone : ${order.telephone}
📍 Ville : ${order.ville}
🏠 Adresse : ${order.adresse}
📝 Note : ${note}

${orderLine}`;
}

/** Builds a `https://wa.me/...` URL for a COD order (client). */
export function buildWhatsAppOrderUrl(order: OrderForWhatsAppClient): string {
  const text = buildWhatsAppOrderMessage(order);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/** Generic WhatsApp contact link for the floating button. */
export function buildWhatsAppContactUrl(message?: string): string {
  const text =
    message || "Bonjour BISOU, j'aimerais en savoir plus sur vos bijoux ✨";
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/** Product-specific question link (PDP WhatsApp CTA). */
export function buildWhatsAppProductQuestionUrl(
  productName: string,
  price: number,
): string {
  const text = `Bonjour BISOU, je suis intéressé(e) par "${productName}" (${price} MAD). Pouvez-vous me donner plus d'informations ?`;
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}
