/**
 * /checkout — COD order page
 * --------------------------
 * Server component: loads active cities from Payload, optionally resolves
 * a product by `?produit=<slug>` to pre-fill the recap, then renders the
 * client-side <CheckoutForm />.
 *
 * Query params supported (for compatibility with the legacy HF Space):
 *   - `produit` : product slug (preferred)
 *   - `nom`     : free-text product name (fallback)
 *   - `prix`    : free-text price (fallback, parsed to number)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/Container';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CodNotice } from '@/components/checkout/CodNotice';
import {
  ProductRecap,
  type ProductRecapData,
} from '@/components/checkout/ProductRecap';
import type { CityOption } from '@/components/checkout/CitySelect';
import { getPayloadClient } from '@/lib/payload';

export const metadata: Metadata = {
  title: 'Commande COD — Paiement à la livraison',
  description:
    'Finalisez votre commande BISOU en paiement à la livraison. Livraison partout au Maroc sous 48-72h, garantie 6 mois.',
  robots: { index: false, follow: true }, // transactional page
};

export const dynamic = 'force-dynamic';

type SearchParams = {
  produit?: string;
  nom?: string;
  prix?: string;
};

type CheckoutProductData = {
  slug?: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  badge?: string;
};

async function loadCities(): Promise<CityOption[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'cities',
      where: { active: { equals: true } },
      sort: 'name_fr',
      limit: 50,
      depth: 0,
    });
    return res.docs.map((c) => ({
      slug: String(c.slug),
      name_fr: String(c.name_fr),
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[BISOU] Failed to load cities', err);
    return [];
  }
}

async function loadProduct(
  params: SearchParams,
): Promise<CheckoutProductData | null> {
  // Prefer slug → Payload lookup
  if (params.produit) {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: 'products',
        where: { slug: { equals: params.produit } },
        limit: 1,
        depth: 1,
      });
      const doc = res.docs[0];
      if (doc) {
        // Best-effort image extraction — tolerant of seeded vs. fully populated
        let imageUrl: string | null = null;
        const imgs = (doc as unknown as { images?: Array<{ image?: { url?: string } | string }> }).images;
        if (Array.isArray(imgs) && imgs.length > 0) {
          const first = imgs[0];
          if (first && typeof first === 'object' && 'image' in first) {
            const img = (first as { image?: { url?: string } | string }).image;
            if (img && typeof img === 'object' && 'url' in img) {
              imageUrl = img.url ?? null;
            }
          }
        }
        return {
          slug: String(doc.slug),
          name: String(doc.name_fr),
          price: Number(doc.price_mad),
          imageUrl,
        };
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[BISOU] Failed to load product for checkout', err);
    }
  }

  // Legacy fallback: accept free-text `nom` + `prix` params
  if (params.nom && params.prix) {
    const price = Number.parseFloat(params.prix);
    if (Number.isFinite(price) && price > 0) {
      return { name: params.nom, price };
    }
  }

  return null;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [cities, product] = await Promise.all([
    loadCities(),
    loadProduct(searchParams),
  ]);

  if (!product) {
    // No product specified — send to 404 so customers don't submit
    // an order without context. Links to the shop should always carry
    // `?produit=<slug>`.
    notFound();
  }

  const recap: ProductRecapData = {
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    badge: product.badge,
  };

  return (
    <main className="min-h-screen bg-black py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70">
            Étape finale
          </p>
          <h1 className="mt-2 font-serif text-3xl text-cream sm:text-4xl">
            Finaliser votre commande
          </h1>
          <p className="mt-2 text-sm text-grey">
            Paiement à la livraison · Livraison 48-72h · Garantie 6 mois
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <ProductRecap product={recap} />

          <div className="rounded-[14px] border border-gold/15 bg-card p-5 sm:p-7">
            <CheckoutForm
              cities={cities}
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
              }}
            />
          </div>

          <CodNotice />

          <div className="text-center text-xs text-grey">
            Besoin d&apos;aide ? Écrivez-nous directement via le bouton
            WhatsApp en bas à droite de l&apos;écran.
          </div>
        </div>
      </Container>
    </main>
  );
}
