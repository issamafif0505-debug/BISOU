---
name: bisou-seo-ecommerce
description: SEO technique e-commerce pour BISOU — Schema.org (Product, Article, Organization, LocalBusiness, BreadcrumbList), sitemap dynamique, Core Web Vitals > 90, hreflang fr-MA / ar-MA. Charge pour tout ce qui touche au SEO.
when_to_use: `generateMetadata()`, JSON-LD, sitemap, robots, OG images, optimisation CWV, articles blog.
---

# BISOU — SEO E-commerce

## Objectifs
- **Core Web Vitals > 90** sur toutes les pages clés (Homepage, PDP, collection, checkout)
- **Schema.org valide** (tester sur Google Rich Results Test)
- **hreflang fr-MA / ar-MA / x-default** sur toutes les pages
- **Sitemap dynamique** depuis Payload
- **OG images** uniques par route

## `generateMetadata()` pattern
```ts
// src/app/(shop)/produits/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getPayload().find({ collection: 'products', where: { slug: { equals: params.slug } } });
  const p = product.docs[0];
  return {
    title: p.seo?.title ?? p.name_fr,
    description: p.seo?.description ?? `${p.name_fr} — ${p.price_mad} MAD. Livraison COD partout au Maroc.`,
    openGraph: {
      title: p.seo?.title ?? p.name_fr,
      description: p.seo?.description,
      images: [p.seo?.ogImage?.url ?? p.images[0].url],
      type: 'website',
    },
    alternates: {
      canonical: `/produits/${p.slug}`,
      languages: { 'fr-MA': `/produits/${p.slug}`, 'ar-MA': `/ar/produits/${p.slug}` },
    },
  };
}
```

## Schema.org Product
```tsx
// components/seo/ProductSchema.tsx
export function ProductSchema({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_fr,
    description: product.description_fr,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'BISOU' },
    offers: {
      '@type': 'Offer',
      url: `https://bisou.ma/produits/${product.slug}`,
      priceCurrency: 'MAD',
      price: product.price_mad,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'BISOU' },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
```

## Schemas à implémenter
- `Product` — PDP
- `Article` + `FAQPage` — blog posts
- `Organization` + `LocalBusiness` — layout shop (adresse Marrakech)
- `BreadcrumbList` — toutes les pages profondes
- `ItemList` — pages collections

## `app/sitemap.ts` dynamique
```ts
import type { MetadataRoute } from 'next';
import { getPayload } from '@/lib/payload';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload();
  const [products, posts, categories, pages] = await Promise.all([
    payload.find({ collection: 'products', limit: 1000 }),
    payload.find({ collection: 'blog-posts', limit: 1000 }),
    payload.find({ collection: 'categories', limit: 100 }),
    payload.find({ collection: 'pages', limit: 100 }),
  ]);
  const base = 'https://bisou.ma';
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    ...products.docs.map((p) => ({
      url: `${base}/produits/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.9,
    })),
    ...posts.docs.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.7,
    })),
    ...categories.docs.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      priority: 0.8,
    })),
  ];
}
```

## `app/robots.ts`
```ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: 'https://bisou.ma/sitemap.xml',
    host: 'https://bisou.ma',
  };
}
```

## Core Web Vitals
- **LCP < 2.5s** : `next/image` avec `priority` sur l'image hero, fonts preload
- **CLS < 0.1** : dimensions explicites sur toutes les images, skeleton sur les grilles
- **INP < 200ms** : server components par défaut, hydratation sélective
- Pas de CSS inline volumineux, pas de JS bloquant

## Articles blog — 5 cibles SEO long-tail
1. `/blog/bijoux-hypoallergeniques-maroc`
2. `/blog/acier-316l-vs-plaque-or`
3. `/blog/bijoux-sans-allergie-femme-marocaine`
4. `/blog/bracelet-etanche-mariage-maroc`
5. `/blog/collier-prenom-arabe-cadeau`

Chaque article : 1200+ mots, `Article` + `FAQPage` JSON-LD, OG image, internal links vers produits pertinents.
