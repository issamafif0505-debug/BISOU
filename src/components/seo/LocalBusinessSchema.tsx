/**
 * LocalBusinessSchema — Schema.org JewelryStore JSON-LD
 * -------------------------------------------------------
 * Rendered on the public layout. Signals to Google that BISOU is a
 * physical jewelry store (even if online-first) anchored in Marrakech.
 *
 * This feeds the Google Maps / Knowledge Graph panel and the
 * "near me" queries for local searches ("bijoux Marrakech").
 */

import React from 'react';

import { BASE_URL, SITE_NAME } from '@/lib/seo';

import { JsonLd } from './JsonLd';

export function LocalBusinessSchema(): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    '@id': `${BASE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${BASE_URL}/og/default.png`,
    logo: `${BASE_URL}/logo.svg`,
    url: BASE_URL,
    // Le numéro réel est dans .env — placeholder ici pour la KG.
    telephone: '+212-000-000000',
    priceRange: '139 MAD - 599 MAD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Medina',
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakech-Safi',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6295,
      longitude: -7.9811,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    paymentAccepted: ['Cash', 'Cash on Delivery', 'Card'],
    currenciesAccepted: 'MAD',
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    hasMap: 'https://www.google.com/maps?q=Marrakech+Medina',
    sameAs: [
      'https://www.instagram.com/bisou.ma',
      'https://www.facebook.com/bisou.ma',
      'https://www.tiktok.com/@bisou.ma',
    ],
  };

  return <JsonLd data={data} id="bisou-localbusiness-jsonld" />;
}

export default LocalBusinessSchema;
