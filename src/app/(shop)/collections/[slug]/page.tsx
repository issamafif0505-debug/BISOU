import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import type { ProductCardData } from '@/components/shop/ProductCard';

interface Props {
  params: { slug: string };
}

const categoryLabels: Record<string, string> = {
  colliers: 'Colliers',
  bagues: 'Bagues',
  boucles: "Boucles d'oreilles",
  bracelets: 'Bracelets',
  coffrets: 'Coffrets cadeaux',
  editions: 'Éditions limitées',
};

const categoryDescriptions: Record<string, string> = {
  colliers: 'Nos colliers plaqués or — du minimaliste au statement, pour toutes les occasions.',
  bagues: 'Bagues en acier 316L plaqué or : signatures, chevalières, empilables.',
  boucles: "Créoles, puces et boucles pendantes en or plaqué 18K. Hypoallergéniques.",
  bracelets: 'Bracelets chaîne, joncs et gourmettes en or plaqué. Waterproof.',
  coffrets: 'Coffrets cadeaux prêts à offrir — packaging luxe inclus.',
  editions: 'Éditions limitées BISOU — pièces rares, collection capsule.',
};

async function loadCategoryWithProducts(slug: string): Promise<{
  name: string;
  description: string;
  products: ProductCardData[];
} | null> {
  try {
    const payload = await getPayloadClient();
    const catRes = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const cat = catRes.docs[0];
    if (!cat) return null;

    const prodRes = await payload.find({
      collection: 'products',
      where: {
        and: [
          { category: { equals: cat.id } },
          { inStock: { equals: true } },
        ],
      },
      limit: 50,
      depth: 1,
    });

    const products: ProductCardData[] = prodRes.docs.map((doc) => {
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
        badges: (doc as unknown as { badges?: ProductCardData['badges'] }).badges,
      };
    });

    return {
      name: String(cat.name_fr),
      description: cat.description_fr ? String(cat.description_fr) : (categoryDescriptions[slug] ?? ''),
      products,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = categoryLabels[params.slug] ?? params.slug;
  return {
    title: `${label} — Bijoux plaqués or`,
    description: categoryDescriptions[params.slug] ?? `Découvrez notre collection ${label} en acier 316L plaqué or.`,
    alternates: { canonical: `/collections/${params.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await loadCategoryWithProducts(params.slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Collections', url: '/collections' },
          { name: data.name },
        ]}
      />

      {/* Category header */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-black-soft to-black overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-dark-radial opacity-30" />
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <nav className="mb-4 text-xs uppercase tracking-[0.18em] text-grey font-sans">
              <a href="/collections" className="hover:text-gold transition-colors">Collections</a>
              {' / '}
              <span className="text-gold">{data.name}</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl text-cream font-light">
              {data.name}
            </h1>
            <p className="mt-4 text-grey font-sans text-base leading-relaxed max-w-lg">
              {data.description}
            </p>
            <p className="mt-3 text-xs text-gold/70 uppercase tracking-[0.18em] font-sans">
              {data.products.length} pièce{data.products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Container>
      </section>

      <Container className="mt-12">
        {data.products.length > 0 ? (
          <ProductGrid products={data.products} columns={4} priorityCount={4} />
        ) : (
          <div className="py-24 text-center text-grey font-sans">
            <p className="text-xl">Collection à venir très bientôt…</p>
          </div>
        )}
      </Container>
    </main>
  );
}
