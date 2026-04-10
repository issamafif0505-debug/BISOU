/**
 * BISOU Maroc — Payload CMS 3.0 Configuration
 * --------------------------------------------
 * Next.js-native Payload config. Mounts collections, DB (Postgres),
 * the Lexical editor, admin UI, Cloudinary-ready media storage, and
 * generates TypeScript types to `src/types/payload-types.ts`.
 *
 * Docs: https://payloadcms.com/docs/configuration/overview
 */

import path from 'path';
import { fileURLToPath } from 'url';

import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// Collections
import { Users } from './src/collections/Users';
import { Media } from './src/collections/Media';
import { Categories } from './src/collections/Categories';
import { Products } from './src/collections/Products';
import { Cities } from './src/collections/Cities';
import { Orders } from './src/collections/Orders';
import { BlogPosts } from './src/collections/BlogPosts';
import { Pages } from './src/collections/Pages';
import { Reviews } from './src/collections/Reviews';
import { Influencers } from './src/collections/Influencers';
import { LogisticsPartners } from './src/collections/LogisticsPartners';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const corsList = [appUrl].filter(Boolean) as string[];
const csrfList = [appUrl].filter(Boolean) as string[];

export default buildConfig({
  // Admin UI
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — BISOU Admin',
      // description: "Tableau de bord BISOU Maroc",
    },
  },

  // Lexical rich-text editor (Payload 3.0 default)
  editor: lexicalEditor({}),

  // Collections registered in the order they should appear in the admin sidebar.
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Cities,
    Orders,
    BlogPosts,
    Pages,
    Reviews,
    Influencers,
    LogisticsPartners,
  ],

  // Secret used to sign auth cookies / resets.
  // Must be set in .env / .env.local (see .env.example).
  secret: process.env.PAYLOAD_SECRET || 'BISOU_DEV_SECRET_CHANGE_ME',

  // Postgres adapter (Railway / Neon / Supabase compatible).
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  // TypeScript types auto-generated (re-run via `pnpm generate:types`).
  typescript: {
    outputFile: path.resolve(dirname, 'src/types/payload-types.ts'),
  },

  // CORS / CSRF whitelist — only our own app URL.
  cors: corsList,
  csrf: csrfList,

  // Telemetry off — respect user privacy by default.
  telemetry: false,

  // Async onInit hook — first boot creates the initial admin user from env.
  // NOTE: the actual seed runner lives in `src/seed/seed.ts` (pnpm seed).
  // This is kept simple here so `pnpm dev` works even without running seeds.
  onInit: async (payload) => {
    payload.logger.info('BISOU Payload initialized.');
  },
});
