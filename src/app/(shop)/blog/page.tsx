import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPayloadClient } from '@/lib/payload';
import { Container, SectionTitle, Card } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';

export const metadata: Metadata = {
  title: 'Journal BISOU — Conseils bijoux & tendances',
  description:
    'Guides et conseils bijoux plaqués or : comment choisir, entretenir et porter ses bijoux au Maroc. Articles par BISOU.',
  alternates: { canonical: '/blog' },
};

async function loadPosts() {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      sort: '-publishedAt',
      limit: 12,
      depth: 1,
    });
    return res.docs;
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await loadPosts();

  return (
    <main className="min-h-screen bg-black pb-24">
      <OrganizationSchema />
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Journal' }]}
      />

      <section className="relative py-16 md:py-24 bg-gradient-to-b from-black-soft to-black">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <SectionTitle
              eyebrow="Journal BISOU"
              title={<>Conseils & <em className="italic text-gold-gradient not-italic">tendances</em></>}
              subtitle="Guides pratiques, astuces d'entretien et tendances bijoux pour la femme marocaine moderne."
            />
          </div>
        </Container>
      </section>

      <Container className="mt-12">
        {posts.length === 0 ? (
          <div className="py-24 text-center text-grey font-sans">
            <p className="text-xl">Les articles arrivent très bientôt…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const img = (post as unknown as { featuredImage?: { url?: string; alt?: string } }).featuredImage;
              const slug = String(post.slug);
              const title = String(post.title_fr);
              const excerpt = post.excerpt_fr ? String(post.excerpt_fr) : '';
              const publishedAt = post.publishedAt ? String(post.publishedAt) : '';
              const author = post.author ? String(post.author) : 'BISOU Team';

              return (
                <Link key={slug} href={`/blog/${slug}`} className="group">
                  <Card padding="none" className="flex flex-col overflow-hidden h-full transition-all duration-bisou hover:-translate-y-1 hover:shadow-card-hover hover:border-gold/40">
                    {img?.url ? (
                      <div className="relative aspect-video overflow-hidden bg-black-soft">
                        <Image
                          src={img.url}
                          alt={img.alt ?? title}
                          fill
                          sizes="(max-width: 768px) 90vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-black-soft flex items-center justify-center">
                        <span className="font-serif text-4xl text-gold/30">B</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-3 p-5 flex-1">
                      {publishedAt && (
                        <time className="text-[10px] uppercase tracking-[0.18em] text-gold/70 font-sans">
                          {formatDate(publishedAt)}
                        </time>
                      )}
                      <h2 className="font-serif text-xl text-cream leading-snug group-hover:text-gold transition-colors">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="text-sm text-grey font-sans line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-3 border-t border-white/5 text-xs text-grey font-sans">
                        {author}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
