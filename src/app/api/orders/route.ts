/**
 * POST /api/orders
 * ----------------
 * Public endpoint consumed by the CheckoutForm to create a new COD order.
 *
 * Flow:
 *   1. Rate-limit by IP (10 req/min)
 *   2. Parse + validate body with Zod (`orderSchema`)
 *   3. Resolve ville slug → Payload city ID
 *   4. (Optional) resolve product slug → Payload product ID
 *   5. Create the order via Payload local API (hook generates CMD-###)
 *   6. Fire-and-forget to UpConfirm (non-blocking)
 *   7. (TODO Agent 5) Fire Meta CAPI server-side event (Purchase)
 *   8. Return `{ ok, orderId, whatsappUrl }` — client opens WhatsApp + redirects
 *
 * Errors:
 *   - 400 invalid JSON / validation fail
 *   - 422 unknown city
 *   - 429 rate-limited
 *   - 500 server error (Payload crash)
 */

import { NextResponse, type NextRequest } from 'next/server';

import { getPayloadClient } from '@/lib/payload';
import { checkRateLimit, gcRateLimit } from '@/lib/rate-limit';
import { submitOrderToUpConfirm } from '@/lib/upconfirm';
import { orderSchema } from '@/lib/validation';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Rate limit — best-effort IP extraction (Vercel forwards via x-forwarded-for)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  gcRateLimit();
  if (!checkRateLimit(`orders:${ip}`)) {
    return NextResponse.json(
      { error: 'Trop de requêtes, réessayez dans une minute.' },
      { status: 429 },
    );
  }

  // 2. Parse + validate
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json(
      { error: 'Requête invalide (JSON attendu)' },
      { status: 400 },
    );
  }

  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation échouée',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const payload = await getPayloadClient();

    // 3. Resolve city slug → Payload ID
    const cityRes = await payload.find({
      collection: 'cities',
      where: { slug: { equals: data.ville } },
      limit: 1,
      depth: 0,
    });
    const cityDoc = cityRes.docs[0];
    if (!cityDoc) {
      return NextResponse.json(
        { error: `Ville inconnue : ${data.ville}` },
        { status: 422 },
      );
    }

    // 4. Resolve product slug → Payload ID (optional)
    let productRefId: string | number | undefined;
    if (data.productSlug) {
      const productRes = await payload.find({
        collection: 'products',
        where: { slug: { equals: data.productSlug } },
        limit: 1,
        depth: 0,
      });
      if (productRes.docs[0]) {
        productRefId = productRes.docs[0].id;
      }
    }

    // 5. Create the order — hook generates CMD-###
    const order = await payload.create({
      collection: 'orders',
      data: {
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone,
        ville: cityDoc.id,
        adresse: data.adresse,
        produit: data.produit,
        ...(productRefId ? { productRef: productRefId } : {}),
        prix_mad: data.prix,
        ...(data.note ? { note: data.note } : {}),
        statut: 'pending',
        source: 'website',
        ...(data.metaFbc ? { metaFbc: data.metaFbc } : {}),
        ...(data.metaFbp ? { metaFbp: data.metaFbp } : {}),
        ip,
        userAgent: req.headers.get('user-agent') || undefined,
      },
      overrideAccess: true,
    });

    const orderIdStr = String(order.orderId ?? order.id);
    const cityName = String(cityDoc.name_fr ?? data.ville);

    // 6. Fire UpConfirm (non-blocking)
    void submitOrderToUpConfirm({
      orderId: orderIdStr,
      customerName: `${order.prenom} ${order.nom}`,
      phone: order.telephone,
      product: order.produit,
      amount: Number(order.prix_mad),
      city: cityName,
      address: order.adresse,
    });

    // 7. TODO(Agent 5): Meta CAPI server event
    //   void sendMetaCapiEvent({
    //     event_name: 'Purchase',
    //     event_id: orderIdStr,                // Same as Pixel client event for dedup
    //     user_data: { fbc: data.metaFbc, fbp: data.metaFbp, phone: order.telephone },
    //     custom_data: { value: order.prix_mad, currency: 'MAD', content_ids: [orderIdStr] },
    //   });

    // 8. Build WhatsApp URL for client redirect
    const whatsappUrl = buildWhatsAppOrderUrl({
      orderId: orderIdStr,
      prenom: order.prenom,
      nom: order.nom,
      telephone: order.telephone,
      ville: cityName,
      adresse: order.adresse,
      produit: order.produit,
      prix: Number(order.prix_mad),
      note: order.note ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      orderId: orderIdStr,
      whatsappUrl,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[BISOU] POST /api/orders failed', err);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la commande' },
      { status: 500 },
    );
  }
}
