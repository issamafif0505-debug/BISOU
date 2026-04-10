/**
 * Categories — Product taxonomy
 * ------------------------------
 * 6 items seeded: colliers, bagues, boucles, bracelets, coffrets, editions.
 * Referenced by Products via `category` relationship.
 */

import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'slug', 'order'],
    group: 'Boutique',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Identifiant URL unique (kebab-case). Ex: colliers',
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
      name: 'description_fr',
      type: 'textarea',
      label: 'Description (français)',
    },
    {
      name: 'description_ar',
      type: 'textarea',
      label: 'Description (arabe)',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icône catégorie',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Ordre d\'affichage',
      admin: {
        description: 'Plus petit = affiché en premier.',
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
  ],
};

export default Categories;
