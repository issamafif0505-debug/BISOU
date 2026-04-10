/**
 * ArticleSchema — Schema.org Article JSON-LD
 * --------------------------------------------
 * Rendered on each blog post page. Tells Google who wrote the article,
 * when, and what it's about — unlocks the "Top stories" carousel and
 * rich article cards in SERP.
 *
 * Usage:
 *   <ArticleSchema
 *     article={{
 *       slug: post.slug,
 *       headline: post.title_fr,
 *       description: post.excerpt_fr,
 *       image: post.featuredImage?.url,
 *       datePublished: post.publishedAt,
 *       dateModified: post.updatedAt,
 *       author: post.author,
 *       category: post.category,
 *     }}
 *   />
 */

import React from 'react';

import { BASE_URL, SITE_NAME, blogUrl } from '@/lib/seo';

import { JsonLd } from './JsonLd';

type ArticleSchemaInput = {
  slug: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
  keywords?: string | string[];
  wordCount?: number;
};

type ArticleSchemaProps = {
  article: ArticleSchemaInput;
};

export function ArticleSchema({ article }: ArticleSchemaProps): React.ReactElement {
  const {
    slug,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author = 'BISOU Team',
    category,
    keywords,
    wordCount,
  } = article;

  const url = blogUrl(slug);
  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`
    : `${BASE_URL}/og/default.png`;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    image: [resolvedImage],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'fr-MA',
    ...(category && { articleSection: category }),
    ...(keywords && {
      keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    }),
    ...(wordCount && { wordCount }),
  };

  return <JsonLd data={data} id={`article-jsonld-${slug}`} />;
}

export default ArticleSchema;
