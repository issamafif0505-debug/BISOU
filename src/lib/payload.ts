/**
 * Payload client singleton
 * ------------------------
 * Thin wrapper around `getPayload()` that caches the instance across
 * server component renders and API route calls to avoid re-bootstrapping
 * Payload on every request (which would be catastrophic for perf).
 *
 * Usage (server components / API routes only):
 *   import { getPayloadClient } from '@/lib/payload';
 *   const payload = await getPayloadClient();
 *   const products = await payload.find({ collection: 'products' });
 *
 * NEVER import this from a client component — it is server-only.
 */

import 'server-only';

import { getPayload, type Payload } from 'payload';
import config from '@payload-config';

// Module-scoped cache. In dev, Next.js may hot-reload this module, which is
// fine — the new instance will just re-initialise once.
let cached: Payload | null = null;
let pending: Promise<Payload> | null = null;

export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached;
  if (pending) return pending;

  pending = getPayload({ config }).then((instance) => {
    cached = instance;
    pending = null;
    return instance;
  });

  return pending;
}
