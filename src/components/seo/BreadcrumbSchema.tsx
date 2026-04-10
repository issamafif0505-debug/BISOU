/**
 * BreadcrumbSchema — Schema.org BreadcrumbList JSON-LD
 * -------------------------------------------------------
 * Ajoute une piste de fil d'Ariane structurée à toutes les pages profondes
 * (PDP, blog article, page catégorie). Google affiche les breadcrumbs au
 * lieu de l'URL nue dans les SERP — gros gain de CTR.
 *
 * Usage :
 *   <BreadcrumbSchema
 *     items={[
 *       { name: 'Accueil', url: '/' },
 *       { name: 'Colliers', url: '/collections/colliers' },
 *       { name: 'Collier Minimaliste Or', url: '/produits/collier-minimaliste-or' },
 *     ]}
 *   />
 *
 * Les URLs peuvent être relatives (`/collections/xxx`) ou absolues —
 * elles sont toutes résolues contre BASE_URL.
 */

import React from 'react';

import { absoluteUrl } from '@/lib/seo';

import { JsonLd } from './JsonLd';

type BreadcrumbItem = {
  name: string;
  /** Optional for the last (current) item. */
  url?: string;
};

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps): React.ReactElement | null {
  if (!items || items.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((item) => item.url !== undefined || items.indexOf(item) === items.length - 1)
      .map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        ...(item.url ? { item: absoluteUrl(item.url) } : {}),
      })),
  };

  return <JsonLd data={data} id="breadcrumb-jsonld" />;
}

export default BreadcrumbSchema;
