import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { Container, Badge, Button, ArrowRightIcon, WhatsAppIcon } from '@/components/ui';
import { PriceTag } from '@/components/shop/PriceTag';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { buildWhatsAppProductQuestionUrl } from '@/lib/whatsapp';
import type { BadgeVariant } from '@/components/ui/Badge';

interface Props {
  params: { slug: string };
}

const badgeLabels: Partial<Record<BadgeVariant, string>> = {
  bestseller: 'Bestseller',
  nouveau: 'Nouveau',
  'edition-limitee': 'Édition limitée',
  pack: 'Pack',
};

async function loadProduct(slug: string) {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return res.docs[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await loadProduct(params.slug);
  if (!doc) return { title: 'Produit introuvable' };

  return {
    title: `${String(doc.name_fr)} — Bijou plaqué or`,
    description:
      `Achetez ${String(doc.name_fr)} — ${Number(doc.price_mad)} MAD, paiement à la livraison partout au Maroc. Plaqué or 18K, acier 316L hypoallergénique, garantie 6 mois.`,
    alternates: { canonical: `/produits/${params.slug}` },
    openGraph: { type: 'website' },
  };
}

export default async function ProductPage({ params }: Props) {
  const doc = await loadProduct(params.slug);
  if (!doc) notFound();

  const name = String(doc.name_fr);
  const price = Number(doc.price_mad);
  const material = doc.material ? String(doc.material) : 'Or plaqué 18K · Acier 316L';
  const badges = (doc as unknown as { badges?: BadgeVariant[] }).badges ?? [];
  const description = doc.description_fr;
  const category = (doc as unknown as { category?: { name_fr?: string; slug?: string } }).category;

  // Images
  const imgs = (doc as unknown as { images?: Array<{ image?: { url?: string; alt?: string } | string }> }).images ?? [];
  const images: Array<{ url: string; alt: string }> = [];
  for (const entry of imgs) {
    if (entry && typeof entry === 'object' && 'image' in entry) {
      const img = (entry as { image?: { url?: string; alt?: string } | string }).image;
      if (img && typeof img === 'object' && img.url) {
        images.push({ url: img.url, alt: img.alt || name });
      }
    }
  }
  const mainImage = images[0] ?? { url: '/product-placeholder.svg', alt: name };

  const waUrl = buildWhatsAppProductQuestionUrl(name, price);
  const checkoutUrl = `/checkout?produit=${params.slug}`;

  const categoryName = category?.name_fr ?? 'Bijoux';
  const categorySlug = category?.slug ?? 'collections';

  return (
    <main className="min-h-screen bg-black pb-24">
      <ProductSchema
        product={{
          slug: params.slug,
          name_fr: name,
          price_mad: price,
          material,
          sku: params.slug,
          images: images.length > 0 ? images : undefined,
          categoryName,
          description_fr: typeof description === 'string' ? description : undefined,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Accueil', url: '/' },
          { name: categoryName, url: `/collections/${categorySlug}` },
          { name: name },
        ]}
      />

      <Container className="pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-grey font-sans">
          <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
          {' / '}
          <Link href={`/collections/${categorySlug}`} className="hover:text-gold transition-colors">
            {categoryName}
          </Link>
          {' / '}
          <span className="text-cream">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-black-soft">
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                fill
                priority
                sizes="(max-width: 1100px) 90vw, 45vw"
                className="object-cover"
              />
              {badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {badges.map((b) => (
                    <Badge key={b} variant={b}>{badgeLabels[b] ?? b}</Badge>
                  ))}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-black-soft">
                    <Image src={img.url} alt={img.alt} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70 font-sans mb-2">
                {categoryName}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-cream font-light leading-tight">
                {name}
              </h1>
              <div className="mt-4">
                <PriceTag price={price} size="lg" gold />
              </div>
            </div>

            {/* Material */}
            <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-card px-4 py-3 text-sm font-sans text-grey">
              <span className="h-2 w-2 rounded-full bg-gold" />
              {material}
            </div>

            {/* Description */}
            {description ? (
              <div className="text-grey font-sans text-sm leading-relaxed">
                {typeof description === 'string' ? description : null}
              </div>
            ) : (
              <p className="text-grey font-sans text-sm leading-relaxed">
                Bijou en acier inoxydable 316L plaqué or 18K. Hypoallergénique, waterproof, anti-ternissement.
                Garantie 6 mois incluse. Livraison sous 48-72h partout au Maroc.
              </p>
            )}

            {/* Guarantees */}
            <ul className="flex flex-col gap-2 text-sm text-grey font-sans">
              {[
                '✦ Paiement uniquement à la livraison',
                '✦ Livraison 48-72h partout au Maroc',
                '✦ Garantie 6 mois offerte',
                '✦ Acier 316L hypoallergénique',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">{item}</li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button as="link" href={checkoutUrl} variant="secondary" size="lg" icon={<ArrowRightIcon />} className="flex-1">
                Commander COD
              </Button>
              <Button
                as="a"
                href={waUrl}
                variant="whatsapp"
                size="lg"
                icon={<WhatsAppIcon />}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                Question WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
