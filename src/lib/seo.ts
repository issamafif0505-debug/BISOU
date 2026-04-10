/**
 * SEO helpers — buildMetadata + URL utilities
 * --------------------------------------------
 * Central place for every `generateMetadata()` call in the app. Every page
 * should call `buildMetadata({ ... })` so that canonical URLs, hreflang,
 * OG cards, Twitter cards and robots directives stay consistent.
 *
 * Usage:
 *   // app/(shop)/produits/[slug]/page.tsx
 *   export async function generateMetadata({ params }): Promise<Metadata> {
 *     const product = await getProduct(params.slug);
 *     return buildMetadata({
 *       title: product.name_fr,
 *       description: product.seo?.description ?? product.excerpt,
 *       path: `/produits/${product.slug}`,
 *       image: product.images?.[0]?.url,
 *       type: 'product',
 *     });
 *   }
 *
 * Rules:
 *  - Canonical URL = `${BASE_URL}${path}` (no trailing slash unless root).
 *  - hreflang: fr-MA primary, ar-MA on `/ar/...`, x-default → fr-MA.
 *  - Titles longer than ~60 chars are truncated by Google anyway — prefer short.
 *  - Descriptions should stay ≤ 155 characters.
 */

import type { Metadata } from 'next';

export const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://bisou.ma'
).replace(/\/$/, '');

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'BISOU';

export const DEFAULT_DESCRIPTION =
  "BISOU — Bijoux plaqués or 18K au Maroc. L'or qui t'embrasse. Livraison paiement à la livraison partout au Maroc, sans allergies, sans compromis.";

export const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph-image`;

export type MetadataType = 'website' | 'article' | 'product' | 'profile';

export type BuildMetadataParams = {
  /** Page title (without the site name suffix — it is appended automatically). */
  title: string;
  /** Meta description — keep ≤ 155 characters for best SERP display. */
  description?: string;
  /** Path starting with `/`, e.g. `/produits/collier-minimaliste-or`. */
  path?: string;
  /** Absolute image URL (or relative — will be resolved against BASE_URL). */
  image?: string;
  /** Set `true` on draft / admin / private pages. */
  noindex?: boolean;
  /** OpenGraph `type`. */
  type?: MetadataType;
  /** Extra keywords (comma-joined string or array). */
  keywords?: string | string[];
  /** ISO date string for article:published_time (blog posts only). */
  publishedTime?: string;
  /** ISO date string for article:modified_time. */
  modifiedTime?: string;
  /** Author name(s) — article pages only. */
  authors?: string[];
};

/**
 * Normalise a path so it always starts with `/` and never ends with `/`
 * (except the homepage).
 */
function normalisePath(path: string): string {
  if (!path || path === '/') return '';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/$/, '');
}

/**
 * Resolve a relative or absolute image URL to an absolute one.
 */
function resolveImage(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;
}

/**
 * Build a full Next.js `Metadata` object for any page in BISOU.
 * Use this in every `generateMetadata()` call.
 */
export function buildMetadata(params: BuildMetadataParams): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = '',
    image,
    noindex = false,
    type = 'website',
    keywords,
    publishedTime,
    modifiedTime,
    authors,
  } = params;

  const normalisedPath = normalisePath(path);
  const url = `${BASE_URL}${normalisedPath}`;
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const ogImage = resolveImage(image) ?? `${BASE_URL}/og/default.png`;

  // hreflang alternates
  const frUrl = url;
  const arUrl = `${BASE_URL}/ar${normalisedPath}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    alternates: {
      canonical: url,
      languages: {
        'fr-MA': frUrl,
        'ar-MA': arUrl,
        'x-default': frUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'fr_MA',
      alternateLocale: ['ar_MA'],
      type: (type === 'product' ? 'website' : type) as
        | 'website'
        | 'article'
        | 'profile',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };

  return metadata;
}

/**
 * Prefix a path with BASE_URL — useful for sitemaps, RSS, emails, canonicals.
 */
export function absoluteUrl(path: string): string {
  if (!path) return BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Build a full product URL from its slug.
 */
export function productUrl(slug: string): string {
  return absoluteUrl(`/produits/${slug}`);
}

/**
 * Build a full blog post URL from its slug.
 */
export function blogUrl(slug: string): string {
  return absoluteUrl(`/blog/${slug}`);
}

/**
 * Build a full category URL from its slug.
 */
export function categoryUrl(slug: string): string {
  return absoluteUrl(`/collections/${slug}`);
}
