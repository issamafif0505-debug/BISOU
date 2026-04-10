/**
 * Payload admin route group — root layout
 * -----------------------------------------
 * Payload 3.0 ships its own admin UI stylesheet and React tree. We delegate
 * everything to `@payloadcms/next/layouts` so our own `src/app/layout.tsx`
 * (shop-facing) doesn't leak Tailwind / marketing fonts into the admin.
 *
 * Route group: `(payload)` — does NOT contribute to the URL.
 * Admin lives at `/admin`.
 */

import React from 'react';
// Payload's Next.js helpers re-export a RootLayout that wires up the admin.
// Importing via the package entry keeps us future-proof across Payload 3.x.
import { RootLayout } from '@payloadcms/next/layouts';

import config from '../../../payload.config';
import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config}>{children}</RootLayout>
);

export default Layout;
