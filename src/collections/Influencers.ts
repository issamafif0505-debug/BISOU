/**
 * Influencers — Marketing CRM
 * ----------------------------
 * Internal collection to track influencer outreach. Not publicly readable.
 * Seed source: `docs/influencers-database.md` (to be imported by Agent 5).
 */

import type { CollectionConfig } from 'payload';

export const Influencers: CollectionConfig = {
  slug: 'influencers',
  labels: {
    singular: 'Influenceur',
    plural: 'Influenceurs',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'handle', 'platform', 'followers', 'status'],
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
      label: 'Nom complet',
    },
    {
      name: 'handle',
      type: 'text',
      label: 'Pseudo (@handle)',
    },
    {
      name: 'platform',
      type: 'select',
      label: 'Plateforme principale',
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    {
      name: 'followers',
      type: 'number',
      min: 0,
      label: 'Followers',
    },
    {
      name: 'engagementRate',
      type: 'number',
      min: 0,
      max: 100,
      label: 'Taux d\'engagement (%)',
    },
    {
      name: 'niche',
      type: 'text',
      label: 'Niche',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'rate',
      type: 'number',
      min: 0,
      label: 'Tarif par collab (MAD)',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'prospect',
      label: 'Statut',
      options: [
        { label: 'Prospect', value: 'prospect' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'Actif', value: 'active' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes internes',
    },
  ],
};

export default Influencers;
