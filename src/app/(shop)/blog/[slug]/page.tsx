import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { Container } from '@/components/ui';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ProductCard } from '@/components/shop/ProductCard';
import type { ProductCardData } from '@/components/shop/ProductCard';

interface Props {
  params: { slug: string };
}

async function loadPost(slug: string) {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return res.docs[0] ?? null;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost(params.slug);
  if (!post) return { title: 'Article introuvable' };

  const seo = (post as unknown as { seo?: { title?: string; description?: string } }).seo;

  return {
    title: seo?.title ?? String(post.title_fr),
    description: seo?.description ?? (post.excerpt_fr ? String(post.excerpt_fr) : undefined),
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: { type: 'article' },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await loadPost(params.slug);
  if (!post) notFound();

  const title = String(post.title_fr);
  const excerpt = post.excerpt_fr ? String(post.excerpt_fr) : '';
  const author = post.author ? String(post.author) : 'BISOU Team';
  const publishedAt = post.publishedAt ? String(post.publishedAt) : '';
  const img = (post as unknown as { featuredImage?: { url?: string; alt?: string } }).featuredImage;
  const relatedProducts = (post as unknown as { relatedProducts?: unknown[] }).relatedProducts ?? [];

  const products: ProductCardData[] = relatedProducts.map((p) => {
    const doc = p as { slug?: string; name_fr?: string; price_mad?: number; images?: Array<{ image?: { url?: string } }> };
    const imgUrl = doc.images?.[0]?.image?.url ?? null;
    return {
      slug: String(doc.slug ?? ''),
      name: String(doc.name_fr ?? ''),
      price: Number(doc.price_mad ?? 0),
      imageUrl: imgUrl,
    };
  }).filter((p) => p.slug !== '');

  return (
    <main className="min-h-screen bg-black pb-24">
      <ArticleSchema
        article={{
          slug: params.slug,
          headline: title,
          description: excerpt,
          image: img?.url,
          datePublished: publishedAt,
          author,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Journal', url: '/blog' },
          { name: title },
        ]}
      />

      {/* Hero image */}
      {img?.url ? (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-black-soft">
          <Image
            src={img.url}
            alt={img.alt ?? title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black" />
        </div>
      ) : (
        <div className="h-20" />
      )}

      <Container className="max-w-3xl mt-8 md:mt-12">
        {/* Meta */}
        <nav className="mb-4 text-xs uppercase tracking-[0.15em] text-grey font-sans">
          <Link href="/blog" className="hover:text-gold transition-colors">Journal</Link>
          {' / '}
          <span className="text-gold">{title}</span>
        </nav>

        {publishedAt && (
          <time className="block text-[10px] uppercase tracking-[0.22em] text-gold/70 font-sans mb-4">
            {formatDate(publishedAt)} · {author}
          </time>
        )}

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream font-light leading-tight">
          {title}
        </h1>

        {excerpt && (
          <p className="mt-6 text-lg text-grey font-sans leading-relaxed border-l-2 border-gold/40 pl-4">
            {excerpt}
          </p>
        )}

        {/* Content — RichText rendered as HTML placeholder for now */}
        <div className="mt-10 prose prose-invert prose-headings:font-serif prose-headings:text-cream prose-p:text-grey prose-p:leading-relaxed prose-a:text-gold prose-strong:text-cream max-w-none">
          {/* TODO: render Lexical richtext — use @payloadcms/richtext-lexical RichText component */}
          <p className="text-grey font-sans leading-relaxed">
            Contenu de l&apos;article à venir — les 5 articles SEO seront remplis lors de la migration finale.
          </p>
        </div>

        {/* Related products */}
        {products.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gold/10">
            <h2 className="font-serif text-2xl text-cream mb-8">
              Bijoux mentionnés dans cet article
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-14 text-center">
          <Link href="/blog" className="text-sm text-grey hover:text-gold transition-colors font-sans underline underline-offset-4">
            ← Retour au journal
          </Link>
        </div>
      </Container>
    </main>
  );
}
