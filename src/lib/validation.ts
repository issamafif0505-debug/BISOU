/**
 * Zod validation schemas shared between client and server.
 * ---------------------------------------------------------
 * - `orderSchema` — input contract for POST /api/orders
 * - `moroccanPhoneRegex` — phone format used by CheckoutForm AND the API
 *
 * The regex here is a (slightly relaxed) port of the one hardcoded in
 * `legacy/brand/checkout-cod.html` (line 729, 985):
 *     /^(0[5-7][0-9]{8}|(\+212)[5-7][0-9]{8})$/
 *
 * We also accept the no-`+` prefix variant `212...` because Meta WhatsApp
 * returns numbers in that shape.
 */

import { z } from 'zod';

/**
 * Matches Moroccan mobile numbers:
 *   - local format: 0[5-7]XXXXXXXX (10 digits)
 *   - international +212: +212[5-7]XXXXXXXX (13 chars)
 *   - international 212:  212[5-7]XXXXXXXX  (12 chars)
 */
export const moroccanPhoneRegex =
  /^(0[5-7][0-9]{8}|(\+?212)[5-7][0-9]{8})$/;

/**
 * Normalises a phone string: strips whitespace, dots, dashes,
 * non-breaking spaces, and parentheses.
 */
export function cleanPhone(input: string): string {
  return input.replace(/[\s.\-()\u00A0]/g, '');
}

export const orderSchema = z.object({
  prenom: z
    .string()
    .min(2, 'Prénom trop court')
    .max(50, 'Prénom trop long')
    .transform((v) => v.trim()),
  nom: z
    .string()
    .min(2, 'Nom trop court')
    .max(50, 'Nom trop long')
    .transform((v) => v.trim()),
  telephone: z
    .string()
    .min(1, 'Téléphone requis')
    .transform(cleanPhone)
    .refine((val) => moroccanPhoneRegex.test(val), {
      message:
        'Format téléphone marocain invalide (ex: 0612345678 ou +212612345678)',
    }),
  ville: z.string().min(1, 'Veuillez sélectionner une ville'),
  adresse: z
    .string()
    .min(10, 'Adresse trop courte (min 10 caractères)')
    .max(500, 'Adresse trop longue')
    .transform((v) => v.trim()),
  note: z
    .string()
    .max(500, 'Note trop longue')
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  produit: z.string().min(1, 'Produit requis'),
  productSlug: z.string().optional(),
  prix: z.number().positive('Prix invalide'),
  // Tracking metadata (optional — sent only if Meta Pixel captured them)
  metaFbc: z.string().optional(),
  metaFbp: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
