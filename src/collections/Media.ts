/**
 * Media — Upload collection
 * -------------------------
 * Stores images (products, blog, OG, logos, etc.).
 *
 * Storage strategy:
 *  - Phase 1 (current): Local filesystem `public/media/` — works out of the box,
 *    no extra env var required, great for dev + initial Vercel deploy.
 *  - Phase 2 (TODO): Cloudinary via `@payloadcms/storage-cloudinary` or the
 *    `@payloadcms/plugin-cloud-storage` with a Cloudinary adapter, once the
 *    plugin is stable for Payload 3.0.
 *
 * Image sizes are generated automatically on upload (thumbnail / card / hero).
 * Every image requires an `alt` text for a11y + SEO.
 */

import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
    group: 'Contenu',
  },
  access: {
    read: () => true, // Media is publicly readable — images are served on the shop.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    // TODO Phase 2: migrate to Cloudinary adapter.
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 800,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: 900,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texte alternatif (a11y + SEO)',
      admin: {
        description: 'Décrit l\'image pour les lecteurs d\'écran et le référencement.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende (optionnelle)',
    },
  ],
};

export default Media;
