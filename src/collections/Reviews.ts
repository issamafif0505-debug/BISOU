/**
 * Reviews — Product reviews
 * --------------------------
 * Public can read only approved reviews (filtered at query time by the shop).
 * Only admins can approve / toggle verified badge.
 */

import type { CollectionConfig } from 'payload';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Avis',
    plural: 'Avis',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'product', 'rating', 'approved', 'publishedAt'],
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
      label: 'Produit',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Auteur',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Note (1-5)',
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Commentaire',
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Achat vérifié',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Approuvé (modération)',
    },
  ],
};

export default Reviews;
