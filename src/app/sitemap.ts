/**
 * sitemap.ts — Dynamic XML sitemap
 * ---------------------------------
 * Reads every indexable document from Payload (products, categories,
 * blog posts, legal pages) and concatenates them with the static routes
 * (homepage, /collections, /blog, /about, /contact).
 *
 * Next.js calls this function at build time and (via ISR) on demand.
 * Output is served at `/sitemap.xml`.
 *
 * Bisou rules:
 *  - Admin routes (/admin, /api) are excluded by `app/robots.ts`, not here.
 *  - All URLs use the canonical domain from `BASE_URL`.
 *  - `lastModified` comes from Payload's `updatedAt` field.
 *  - Priority tiers: homepage (1.0) > collections (0.9) > products (0.9)
 *    > blog posts (0.7) > static pages (0.6).
 */

import type { MetadataRoute } from 'next';

import { getPayloadClient } from '@/lib/payload';
import { BASE_URL } from '@/lib/seo';

// Force dynamic rendering so the sitemap always reflects the latest Payload
// state on production. Vercel edge cache will still absorb bursts.
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1h fallback

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static routes — always present ─────────────────────────
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cgv`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politique-confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ── Dynamic routes from Payload ────────────────────────────
  // If Payload isn't bootstrappable (e.g. build-time without DB), we log
  // and fall back to static routes only. We never throw.
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayloadClient();

    const [products, categories, blogPosts, pages] = await Promise.all([
      payload.find({
        collection: 'products',
        limit: 500,
        depth: 0,
        where: { inStock: { equals: true } },
      }),
      payload.find({
        collection: 'categories',
        limit: 100,
        depth: 0,
      }),
      payload.find({
        collection: 'blog-posts',
        limit: 500,
        depth: 0,
      }),
      payload.find({
        collection: 'pages',
        limit: 100,
        depth: 0,
      }),
    ]);

    const productRoutes: SitemapEntry[] = products.docs.map((p: any) => ({
      url: `${BASE_URL}/produits/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const categoryRoutes: SitemapEntry[] = categories.docs.map((c: any) => ({
      url: `${BASE_URL}/collections/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    const blogRoutes: SitemapEntry[] = blogPosts.docs
      .filter((b: any) => b.publishedAt)
      .map((b: any) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // Exclude legal pages already in staticRoutes (they share slugs).
    const excludedPageSlugs = new Set(['cgv', 'mentions-legales', 'politique-confidentialite']);
    const pageRoutes: SitemapEntry[] = pages.docs
      .filter((p: any) => !excludedPageSlugs.has(p.slug))
      .map((p: any) => ({
        url: `${BASE_URL}/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));

    dynamicRoutes = [
      ...productRoutes,
      ...categoryRoutes,
      ...blogRoutes,
      ...pageRoutes,
    ];
  } catch (err) {
    console.warn(
      '[BISOU sitemap] Could not fetch Payload docs — falling back to static routes only.',
      err,
    );
  }

  return [...staticRoutes, ...dynamicRoutes];
}
