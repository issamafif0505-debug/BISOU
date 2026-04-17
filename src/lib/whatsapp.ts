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
import crypto from 'node:crypto';

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

// ─────────────────────────────────────────────────────────────────────────────
// Webhook signature verification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify the `x-hub-signature-256` header sent by Meta on every webhook POST.
 *
 * Meta computes: `sha256_hmac(WA_APP_SECRET, rawBody)` and sends it as
 * `sha256=<hex-digest>`.
 *
 * @param rawBody  Raw request body string (before JSON.parse).
 * @param header   Value of the `x-hub-signature-256` header.
 * @param secret   `WA_APP_SECRET` env variable (the Meta App Secret).
 * @returns        `true` when the signature is valid and the payload is authentic.
 */
export function verifyWhatsAppSignature(
  rawBody: string,
  header: string | null,
  secret: string | undefined,
): boolean {
  if (!header || !secret) return false;

  const expected = header.startsWith('sha256=') ? header.slice(7) : header;

  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Timing-safe comparison prevents timing attacks.
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(expected, 'hex'),
    );
  } catch {
    // Buffers of different lengths throw — treat as invalid signature.
    return false;
  }
}
