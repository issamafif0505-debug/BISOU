/**
 * robots.ts — Next.js dynamic robots.txt
 * ---------------------------------------
 * Allow everything public, disallow admin + API + Next internals.
 * Points crawlers to the dynamic sitemap at /sitemap.xml.
 */

import type { MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
          '/checkout', // avoid indexing the cart / payment funnel
          '/merci',
          '/merci/*',
        ],
      },
      // Explicitly allow Googlebot & bingbot so their crawler budget is clear.
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/merci'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
