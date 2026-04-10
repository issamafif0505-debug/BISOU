/**
 * GET /api/health
 * ---------------
 * Basic healthcheck for Vercel / Cloudflare uptime monitors.
 * Returns 200 + timestamp. Does NOT touch the database so a DB outage
 * doesn't cascade into false alerts.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
