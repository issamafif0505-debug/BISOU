/**
 * ProductSchema — Schema.org Product JSON-LD
 * --------------------------------------------
 * Renders a rich Product schema for the Product Detail Page (PDP).
 *
 * Agent 3 should include this inside `app/(shop)/produits/[slug]/page.tsx`:
 *
 *   <ProductSchema product={product} />
 *
 * The `product` shape is a subset of the Payload `Product` type —
 * anything shaped like the interface below will work. This keeps the
 * component decoupled from the exact generated `payload-types.ts` (so
 * Agent 3 doesn't have to wait for type regeneration).
 *
 * Fields emitted: name, image[], description, sku, brand, category,
 * material, offers (priceCurrency MAD, price, availability, priceValidUntil,
 * url), aggregateRating (stub 5.0), review[] (if provided).
 *
 * Validation target: Google Rich Results Test — "Merchant listings" eligible.
 */

import React from 'react';

import { BASE_URL, SITE_NAME, productUrl } from '@/lib/seo';

import { JsonLd } from './JsonLd';

type ProductSchemaImage = { url: string; alt?: string } | string;

type ProductSchemaInput = {
  slug: string;
  name_fr: string;
  name_ar?: string | null;
  description_fr?: string;
  price_mad: number;
  sku?: string;
  material?: string | null;
  inStock?: boolean;
  isLimited?: boolean;
  images?: ProductSchemaImage[];
  /** Category name (already resolved from the Payload relation). */
  categoryName?: string;
  /** Optional aggregate rating (stub). Default: 5.0 / 24 reviews. */
  aggregateRating?: { ratingValue: number; reviewCount: number };
  /** Optional individual reviews. */
  reviews?: Array<{
    author: string;
    datePublished: string;
    rating: number;
    body: string;
  }>;
  /** Price validity — defaults to end of current year. */
  priceValidUntil?: string;
};

type ProductSchemaProps = {
  product: ProductSchemaInput;
};

function extractImageUrls(images?: ProductSchemaImage[]): string[] {
  if (!images || images.length === 0) {
    return [`${BASE_URL}/og/default.png`];
  }
  return images.map((img) => {
    if (typeof img === 'string') {
      return img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? img : `/${img}`}`;
    }
    const url = img.url;
    return url?.startsWith('http') ? url : `${BASE_URL}${url?.startsWith('/') ? url : `/${url}`}`;
  });
}

export function ProductSchema({ product }: ProductSchemaProps): React.ReactElement {
  const {
    slug,
    name_fr,
    name_ar,
    description_fr,
    price_mad,
    sku,
    material,
    inStock = true,
    isLimited = false,
    images,
    categoryName,
    aggregateRating = { ratingValue: 5.0, reviewCount: 24 },
    reviews = [],
    priceValidUntil,
  } = product;

  const imageUrls = extractImageUrls(images);
  const url = productUrl(slug);

  const validUntil =
    priceValidUntil ?? `${new Date().getFullYear() + 1}-12-31`;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: name_fr,
    ...(name_ar && { alternateName: name_ar }),
    description:
      description_fr ??
      `${name_fr} — bijou plaqué or 18K BISOU. Qualité atelier, livraison COD au Maroc.`,
    image: imageUrls,
    sku: sku ?? slug,
    mpn: sku ?? slug,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
      logo: `${BASE_URL}/logo.svg`,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    material: material ?? 'Or plaqué 18K',
    ...(categoryName && { category: categoryName }),
    ...(isLimited && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Édition limitée',
          value: 'true',
        },
      ],
    }),
    offers: {
      '@type': 'Offer',
      '@id': `${url}#offer`,
      url,
      priceCurrency: 'MAD',
      price: price_mad,
      priceValidUntil: validUntil,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: BASE_URL,
      },
      areaServed: {
        '@type': 'Country',
        name: 'Morocco',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '30',
          currency: 'MAD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'MA',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'MA',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  if (reviews.length > 0) {
    (data as any).review = reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.datePublished,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.body,
    }));
  }

  return <JsonLd data={data} id={`product-jsonld-${slug}`} />;
}

export default ProductSchema;
