/**
 * BlogPosts — SEO content
 * ------------------------
 * 5 cornerstone articles (see plan §5.2) covering long-tail Morocco keywords:
 *  - bijoux hypoallergéniques maroc
 *  - acier 316L vs plaqué or
 *  - bijoux sans allergie femme marocaine
 *  - bracelet étanche mariage maroc
 *  - collier prénom arabe cadeau
 *
 * Each post: 1200+ mots, Schema.org Article, FAQ JSON-LD, related products.
 * Seed creates stubs — Agent 5 fills with real copy.
 */

import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title_fr',
    defaultColumns: ['title_fr', 'category', 'publishedAt', 'author'],
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
      name: 'excerpt_fr',
      type: 'textarea',
      required: true,
      label: 'Extrait (français)',
      admin: {
        description: 'Résumé de 1 à 2 phrases affiché en liste.',
      },
    },
    {
      name: 'excerpt_ar',
      type: 'textarea',
      label: 'Extrait (arabe)',
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image principale',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'guide',
      label: 'Catégorie éditoriale',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Conseil', value: 'conseil' },
        { label: 'Tendance', value: 'tendance' },
        { label: 'Éducation', value: 'education' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'BISOU Team',
      label: 'Auteur',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: 'Date de publication',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Produits liés',
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
        {
          name: 'keywords',
          type: 'text',
          label: 'Mots-clés (séparés par virgules)',
        },
      ],
    },
  ],
};

export default BlogPosts;
