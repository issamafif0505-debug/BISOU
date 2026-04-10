import type { Metadata } from 'next';
import { getPayloadClient } from '@/lib/payload';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { Container, SectionTitle } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import type { CategoryCardData } from '@/components/shop/CategoryCard';

export const metadata: Metadata = {
  title: 'Toutes les collections',
  description:
    'Explorez les collections de bijoux plaqués or BISOU : colliers, bagues, boucles, bracelets, coffrets et éditions limitées. Livraison COD partout au Maroc.',
  alternates: { canonical: '/collections' },
};

async function loadCategories(): Promise<CategoryCardData[]> {
  try {
    const payload = await getPayloadClient();
    const [cats, products] = await Promise.all([
      payload.find({ collection: 'categories', limit: 20, depth: 0 }),
      payload.find({ collection: 'products', limit: 0, depth: 0 }),
    ]);

    // Count products per category
    const countMap: Record<string, number> = {};
    for (const p of products.docs) {
      const cat = (p as unknown as { category?: { id?: string } | string }).category;
      const catId = typeof cat === 'object' && cat ? String(cat.id) : String(cat ?? '');
      if (catId) countMap[catId] = (countMap[catId] ?? 0) + 1;
    }

    return cats.docs.map((c) => ({
      slug: String(c.slug),
      name: String(c.name_fr),
      description: c.description_fr ? String(c.description_fr) : undefined,
      productCount: countMap[String(c.id)] ?? 0,
    }));
  } catch {
    // Fallback static
    return [
      { slug: 'colliers', name: 'Colliers', productCount: 5 },
      { slug: 'bagues', name: 'Bagues', productCount: 5 },
      { slug: 'boucles', name: "Boucles d'oreilles", productCount: 4 },
      { slug: 'bracelets', name: 'Bracelets', productCount: 4 },
      { slug: 'coffrets', name: 'Coffrets cadeaux', productCount: 3 },
      { slug: 'editions', name: 'Éditions limitées', productCount: 2 },
    ];
  }
}

export default async function CollectionsPage() {
  const categories = await loadCategories();

  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Collections' }]}
      />

      {/* Hero section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-black-soft to-black overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-dark-radial opacity-40" />
        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold/80 font-sans">
              <span className="h-px w-8 bg-gold/60" />
              Nos univers
              <span className="h-px w-8 bg-gold/60" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-cream font-light">
              Toutes les{' '}
              <em className="italic text-gold-gradient not-italic">collections</em>
            </h1>
            <p className="mt-4 text-grey font-sans text-base leading-relaxed">
              Six univers bijoux, pensés à Marrakech, livrés partout au Maroc.
            </p>
          </div>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </Container>
    </main>
  );
}
