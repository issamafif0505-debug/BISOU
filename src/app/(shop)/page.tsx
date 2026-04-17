import type { Metadata } from 'next';
import { getPayloadClient } from '@/lib/payload';
import { Hero } from '@/components/shop/Hero';
import { BestsellersSection } from '@/components/shop/BestsellersSection';
import { Testimonials } from '@/components/shop/Testimonials';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { StatsAnimated } from '@/components/shop/StatsAnimated';
import { Container, SectionTitle } from '@/components/ui';
import { buildWhatsAppContactUrl } from '@/lib/whatsapp';
import type { ProductCardData } from '@/components/shop/ProductCard';

export const metadata: Metadata = {
  title: "BISOU — Bijoux plaqués or au Maroc",
  description:
    "L'or qui t'embrasse. Découvrez les bijoux plaqués or BISOU : colliers, bagues, bracelets, boucles. Livraison COD partout au Maroc sous 48-72h.",
  alternates: { canonical: '/' },
};

const categories = [
  { slug: 'colliers', label: 'Colliers' },
  { slug: 'bagues', label: 'Bagues' },
  { slug: 'boucles', label: 'Boucles' },
  { slug: 'bracelets', label: 'Bracelets' },
  { slug: 'coffrets', label: 'Coffrets' },
  { slug: 'editions', label: 'Éditions' },
];

async function loadBestsellers(): Promise<ProductCardData[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'products',
      where: {
        and: [
          { inStock: { equals: true } },
          { badges: { in: ['bestseller'] } },
        ],
      },
      limit: 4,
      depth: 1,
    });
    return res.docs.map((doc) => {
      const imgs = (doc as unknown as { images?: Array<{ image?: { url?: string } | string }> }).images;
      let imageUrl: string | null = null;
      if (Array.isArray(imgs) && imgs.length > 0) {
        const first = imgs[0];
        if (first && typeof first === 'object' && 'image' in first) {
          const img = (first as { image?: { url?: string } | string }).image;
          if (img && typeof img === 'object' && 'url' in img) imageUrl = img.url ?? null;
        }
      }
      return {
        slug: String(doc.slug),
        name: String(doc.name_fr),
        price: Number(doc.price_mad),
        imageUrl,
        badges: (doc as unknown as { badges?: string[] }).badges as ProductCardData['badges'],
      };
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const bestsellers = await loadBestsellers();
  const waUrl = buildWhatsAppContactUrl();

  return (
    <>
      <Hero
        titleTop="L'or qui"
        titleBottom="t'embrasse"
        subtitle="Bijoux plaqués or 18K pensés à Marrakech. Hypoallergéniques, durables, livrés partout au Maroc en paiement à la livraison."
        primaryCta={{ label: 'Découvrir la collection', href: '/collections' }}
        secondaryCta={{ label: 'Commander sur WhatsApp', href: waUrl, whatsapp: true }}
      />

      {/* Catégories */}
      <section className="py-20 md:py-28 bg-black-soft">
        <Container>
          <SectionTitle
            eyebrow="Collections"
            title={<>Explorez nos <em className="italic text-gold-gradient not-italic">univers</em></>}
            subtitle="Six univers bijoux, une seule obsession : vous faire briller."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={{ slug: cat.slug, name: cat.label }} />
            ))}
          </div>
        </Container>
      </section>

      {/* Bestsellers */}
      <BestsellersSection products={bestsellers} />

      {/* Témoignages */}
      <Testimonials />

      {/* Brand story strip */}
      <section className="py-20 bg-black border-y border-gold/10">
        <Container>
          <div className="mx-auto max-w-2xl text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold/80 font-sans">
              <span className="h-px w-8 bg-gold/60" />
              Notre promesse
              <span className="h-px w-8 bg-gold/60" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-cream font-light leading-snug">
              Le luxe accessible,{' '}
              <em className="italic text-gold-gradient not-italic">livré chez vous</em>
            </h2>
            <p className="text-grey font-sans text-base leading-relaxed">
              Chaque bijou BISOU est fabriqué en acier inoxydable 316L, plaqué or 18K.
              Hypoallergénique, waterproof, anti-ternissement. Garantie 6 mois incluse.
              Paiement uniquement à la livraison — zéro risque pour vous.
            </p>
            <StatsAnimated
              items={[
                { stat: '316L', label: 'Acier hypoallergénique' },
                { stat: '48h', label: 'Livraison Maroc' },
                { stat: 'COD', label: 'Paiement à réception' },
              ]}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
