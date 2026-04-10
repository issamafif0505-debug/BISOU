/**
 * Cities — 16 villes Maroc
 * ------------------------
 * Used by the COD checkout form (ville dropdown) and by Orders (relation).
 * `deliveryFee` is informational and can feed the checkout total later.
 */

import type { CollectionConfig } from 'payload';

export const Cities: CollectionConfig = {
  slug: 'cities',
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'region', 'deliveryFee', 'active'],
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
      name: 'region',
      type: 'text',
      label: 'Région',
    },
    {
      name: 'deliveryFee',
      type: 'number',
      min: 0,
      label: 'Frais de livraison (MAD)',
      admin: {
        description: 'Utilisé par le checkout pour calculer le total.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Livraison active',
    },
  ],
};

export default Cities;
