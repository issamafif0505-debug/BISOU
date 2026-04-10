/**
 * LogisticsPartners — Delivery providers
 * ---------------------------------------
 * Internal registry of COD delivery partners (Amana, Glovo, Aramex, CTM, etc.)
 * Each partner can cover specific cities (via `zones` relation).
 * Seed source: `docs/logistics-partners.md` (to be imported by Agent 5).
 */

import type { CollectionConfig } from 'payload';

export const LogisticsPartners: CollectionConfig = {
  slug: 'logistics-partners',
  labels: {
    singular: 'Partenaire logistique',
    plural: 'Partenaires logistiques',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'pricePerDelivery', 'active'],
    group: 'Marketing',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type de livraison',
      options: [
        { label: 'Express', value: 'express' },
        { label: 'Standard', value: 'standard' },
        { label: 'Moto', value: 'moto' },
        { label: 'Point relais', value: 'relais' },
      ],
    },
    {
      name: 'zones',
      type: 'relationship',
      relationTo: 'cities',
      hasMany: true,
      label: 'Zones couvertes',
    },
    {
      name: 'pricePerDelivery',
      type: 'number',
      min: 0,
      label: 'Prix par livraison (MAD)',
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nom contact',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Téléphone',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actif',
    },
  ],
};

export default LogisticsPartners;
