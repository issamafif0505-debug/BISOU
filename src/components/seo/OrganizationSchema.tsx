/**
 * OrganizationSchema — Schema.org Organization JSON-LD
 * ------------------------------------------------------
 * Rendered once on the public layout (`app/(shop)/layout.tsx`).
 * Gives Google the brand entity, social profiles, contact point.
 *
 * Required by Google Rich Results for the "Merchant" knowledge panel.
 *
 * Related: LocalBusinessSchema for the Marrakech physical pickup point.
 */

import React from 'react';

import { BASE_URL, SITE_NAME } from '@/lib/seo';

import { JsonLd } from './JsonLd';

export function OrganizationSchema(): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'BISOU Maroc',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/og/default.png`,
    description:
      "BISOU — Bijoux plaqués or 18K au Maroc. L'or qui t'embrasse. Livraison paiement à la livraison partout au Maroc.",
    slogan: "L'or qui t'embrasse",
    foundingDate: '2025',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Marrakech',
        addressCountry: 'MA',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    sameAs: [
      'https://www.instagram.com/bisou.ma',
      'https://www.facebook.com/bisou.ma',
      'https://www.tiktok.com/@bisou.ma',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'MA',
        availableLanguage: ['French', 'Arabic'],
        // Le numéro réel est dans .env → WA_PHONE_NUMBER.
        // Ici on laisse un placeholder affiché publiquement sur la KG.
        telephone: '+212-000-000000',
        email: 'contact@bisou.ma',
      },
    ],
  };

  return <JsonLd data={data} id="bisou-organization-jsonld" />;
}

export default OrganizationSchema;
