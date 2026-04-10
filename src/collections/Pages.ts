/**
 * Pages — Static / legal pages
 * -----------------------------
 * Generic richText pages for CGV, mentions légales, politique de confidentialité,
 * about, contact, etc. Routed from `src/app/(shop)/[slug]/page.tsx` or
 * dedicated app routes.
 */

import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title_fr',
    defaultColumns: ['title_fr', 'slug', 'updatedAt'],
    group: 'Contenu',
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
    },
    {
      name: 'title_fr',
      type: 'text',
      required: true,
      label: 'Titre (français)',
    },
    {
      name: 'title_ar',
      type: 'text',
      label: 'Titre (arabe)',
    },
    {
      name: 'content_fr',
      type: 'richText',
      required: true,
      label: 'Contenu (français)',
    },
    {
      name: 'content_ar',
      type: 'richText',
      label: 'Contenu (arabe)',
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

export default Pages;
