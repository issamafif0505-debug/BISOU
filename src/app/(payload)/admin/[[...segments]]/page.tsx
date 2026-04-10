/**
 * Payload admin — catch-all page
 * --------------------------------
 * Re-exports Payload's generated admin page. `[[...segments]]` captures
 * every sub-route under `/admin` (collections, globals, custom views, etc.).
 *
 * Do not add business logic here — all views are composed by Payload.
 */

import type { Metadata } from 'next';
import { generatePageMetadata, RootPage } from '@payloadcms/next/views';

import config from '../../../../../payload.config';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap });

export default Page;
