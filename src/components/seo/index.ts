/**
 * SEO components barrel — Schema.org JSON-LD primitives
 * -------------------------------------------------------
 * Single import path for every structured-data component.
 *
 *   import {
 *     OrganizationSchema,
 *     LocalBusinessSchema,
 *     ProductSchema,
 *     BreadcrumbSchema,
 *     ArticleSchema,
 *     FAQSchema,
 *   } from '@/components/seo';
 */

export { default as JsonLd } from './JsonLd';
export { default as OrganizationSchema } from './OrganizationSchema';
export { default as LocalBusinessSchema } from './LocalBusinessSchema';
export { default as ProductSchema } from './ProductSchema';
export { default as BreadcrumbSchema } from './BreadcrumbSchema';
export { default as ArticleSchema } from './ArticleSchema';
export { default as FAQSchema } from './FAQSchema';
