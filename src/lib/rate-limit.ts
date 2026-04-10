/**
 * Rate limiter — in-memory token bucket keyed by IP.
 * ---------------------------------------------------
 * Simple implementation: 10 requests per 60 seconds per IP.
 * Fine for a single Vercel region / low-traffic launch. For production
 * once we scale to multiple regions, swap for Upstash Redis
 * (`@upstash/ratelimit`).
 *
 * NOTE: module-level state resets on every cold start, which is
 * actually fine-ish as a safety net — attackers get a fresh window
 * every few minutes of idle time.
 */

import 'server-only';

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

const buckets = new Map<string, Bucket>();

/**
 * Returns `true` if the request should be allowed, `false` if rate-limited.
 * Call once per public request (inside the route handler).
 */
export function checkRateLimit(
  key: string,
  opts: { max?: number; windowMs?: number } = {},
): boolean {
  const max = opts.max ?? MAX_REQUESTS;
  const windowMs = opts.windowMs ?? WINDOW_MS;
  const now = Date.now();

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= max) return false;

  existing.count += 1;
  return true;
}

/**
 * Best-effort periodic cleanup to keep the Map small.
 * Runs at most once per minute.
 */
let lastGc = 0;
export function gcRateLimit(): void {
  const now = Date.now();
  if (now - lastGc < WINDOW_MS) return;
  lastGc = now;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
