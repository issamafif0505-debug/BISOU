/**
 * Payload admin route group — root layout
 * -----------------------------------------
 * Payload 3.x requires RootLayout to receive:
 *  - config       : SanitizedConfig
 *  - importMap    : ImportMap (client component map)
 *  - serverFunction : ServerFunctionClient (server action wrapping handleServerFunctions)
 *
 * Route group: `(payload)` — does NOT contribute to the URL.
 * Admin lives at `/admin`.
 */

import React from 'react';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';

import config from '../../../payload.config';
import { importMap } from './admin/importMap';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
