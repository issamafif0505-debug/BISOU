---
name: bisou-payload-collections
description: Patterns Payload CMS 3.0 pour BISOU — collections, hooks (beforeChange/beforeRead), relations, localization (fr/ar), accès auth, seeds, migrations, Cloudinary adapter Media. Charge dès que tu touches à `payload.config.ts` ou `src/collections/*`.
when_to_use: Création/modification collections, hooks, seeds, migrations, debugging admin Payload, integration Cloudinary.
---

# BISOU — Payload 3.0 Collections

## Structure
- **`payload.config.ts`** à la racine du repo
- **Collections :** `src/collections/*.ts`
- **Seeds :** `src/seed/*.seed.ts` + `seed.ts` runner
- **Types auto-gen :** `src/types/payload-types.ts` (ne pas éditer à la main)
- **Admin URL :** `/admin` monté via `src/app/(payload)/admin/[[...segments]]/page.tsx`

## Config racine
```ts
// payload.config.ts
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { Products, Categories, Orders, Cities, BlogPosts, Pages, Media, Users, Influencers, LogisticsPartners } from '@/collections';

export default buildConfig({
  admin: { user: 'users', meta: { titleSuffix: '— BISOU Admin' } },
  collections: [Products, Categories, Orders, Cities, BlogPosts, Pages, Media, Users, Influencers, LogisticsPartners],
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI! } }),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: { outputFile: path.resolve(__dirname, 'src/types/payload-types.ts') },
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
});
```

## Collection Products
```ts
import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name_fr', defaultColumns: ['name_fr', 'category', 'price_mad', 'inStock'] },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'name_fr', type: 'text', required: true, localized: false },
    { name: 'name_ar', type: 'text', localized: false },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'price_mad', type: 'number', required: true, min: 0 },
    { name: 'description_fr', type: 'richText' },
    { name: 'description_ar', type: 'richText' },
    { name: 'images', type: 'array', minRows: 1, maxRows: 6, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'badges', type: 'select', hasMany: true, options: ['bestseller', 'nouveau', 'edition-limitee', 'pack'] },
    { name: 'material', type: 'text', defaultValue: 'Or plaqué 18K' },
    { name: 'isLimited', type: 'checkbox', defaultValue: false },
    { name: 'inStock', type: 'checkbox', defaultValue: true },
    { name: 'sku', type: 'text' },
    { name: 'seo', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
    ]},
  ],
  hooks: {
    beforeChange: [autoSlug],
  },
};
```

## Hook auto-slug
```ts
export const autoSlug = async ({ data, operation }) => {
  if (operation === 'create' && !data.slug && data.name_fr) {
    data.slug = data.name_fr.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  }
  return data;
};
```

## Hook Orders — CMD-###
```ts
beforeChange: [
  async ({ operation, data, req }) => {
    if (operation === 'create' && !data.orderId) {
      const last = await req.payload.find({ collection: 'orders', sort: '-createdAt', limit: 1 });
      const n = last.docs[0]
        ? parseInt(last.docs[0].orderId.replace('CMD-', ''), 10) + 1
        : 1;
      data.orderId = `CMD-${String(n).padStart(3, '0')}`;
    }
    return data;
  },
]
```

## Access control
```ts
const isAdmin = ({ req: { user } }) => user?.role === 'admin';
const isAdminOrSelf = ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id;
```

## Media avec Cloudinary
Adapter custom dans `Media.ts` utilisant `lib/cloudinary.ts` — upload direct vers Cloudinary, URL stockée dans Payload. Pas de fichiers sur le filesystem Vercel.

## Seeds (idempotent)
```ts
// src/seed/seed.ts
import { getPayload } from '@/lib/payload';
import { products } from './products.seed';

async function seed() {
  const payload = await getPayload();
  for (const p of products) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'products', data: p });
    }
  }
}
```

## Migrations
- `pnpm payload:migrate` — applique les migrations
- `pnpm payload:migrate:create <name>` — crée une migration manuelle
- Jamais de `db.push` en prod — toujours migrations explicites

## Tips
- `useAsTitle` dans admin config pour éviter "[Untitled]"
- `defaultColumns` pour l'UX admin
- `index: true` sur les champs filtrés/recherchés fréquemment
- `localized: true` sur les champs traduits (fallback automatique via config `localization`)
