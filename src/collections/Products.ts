/**
 * Products — 22 bijoux plaqué or BISOU
 * -------------------------------------
 * Main catalog collection. Seeded via `src/seed/products.seed.ts`.
 * Relationships:
 *  - category → Categories (required)
 *  - images → Media (array, min 1, max 6)
 *  - seo.ogImage → Media
 *  - relatedProducts → Products (self, hasMany)
 *
 * Auto-slug: a `beforeValidate` hook generates the slug from `name_fr`
 * when empty (kebab-case).
 */

import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload';

/**
 * Simple kebab-case slugifier (FR-aware: strips accents).
 */
const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const autoSlug: CollectionBeforeValidateHook = async ({ data, operation }) => {
  if (!data) return data;
  if ((operation === 'create' || operation === 'update') && !data.slug && data.name_fr) {
    data.slug = slugify(data.name_fr);
  }
  return data;
};

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'category', 'price_mad', 'inStock', 'badges'],
    group: 'Boutique',
  },
  access: {
    read: () => true, // Public read (shop pages).
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  hooks: {
    beforeValidate: [autoSlug],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Généré automatiquement depuis le nom français si vide.',
      },
    },
    {
      name: 'name_fr',
      type: 'text',
      required: true,
      label: 'Nom (français)',
    },
    {
      name: 'name_ar',
      type: 'text',
      label: 'Nom (arabe)',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
      label: 'Catégorie',
    },
    {
      name: 'price_mad',
      type: 'number',
      required: true,
      min: 0,
      label: 'Prix (MAD)',
      admin: {
        description: 'Prix en dirhams marocains, hors frais de livraison.',
      },
    },
    {
      name: 'description_fr',
      type: 'richText',
      required: true,
      label: 'Description (français)',
    },
    {
      name: 'description_ar',
      type: 'richText',
      label: 'Description (arabe)',
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      label: 'Images produit',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      label: 'Badges',
      options: [
        { label: 'Bestseller', value: 'bestseller' },
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Édition limitée', value: 'edition-limitee' },
        { label: 'Pack', value: 'pack' },
      ],
    },
    {
      name: 'material',
      type: 'text',
      defaultValue: 'Or plaqué 18K',
      label: 'Matériau',
    },
    {
      name: 'isLimited',
      type: 'checkbox',
      defaultValue: false,
      label: 'Édition limitée',
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      label: 'En stock',
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU',
      admin: {
        description: 'Référence interne (optionnelle).',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre SEO',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Image Open Graph',
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Produits recommandés',
      admin: {
        description: 'Suggestions affichées sur la fiche produit.',
      },
    },
  ],
};

export default Products;
