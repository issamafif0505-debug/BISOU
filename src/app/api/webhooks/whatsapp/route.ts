/**
 * /api/webhooks/whatsapp
 * ----------------------
 * Meta WhatsApp Cloud API webhook endpoint.
 *
 * GET — verification handshake (hub.mode=subscribe, hub.challenge, hub.verify_token)
 *       Returns plain-text challenge when the verify_token matches
 *       WA_WEBHOOK_VERIFY_TOKEN.
 *
 * POST — incoming messages / status updates. For now we only log and ack
 *        with 200. A later iteration will:
 *          - parse message payloads
 *          - link conversations to Orders via the customer phone
 *          - update `statut` when the client replies with a confirmation
 *
 * Signature verification (SHA-256 of WA_APP_SECRET) will be added in a
 * follow-up — Meta sends it in `x-hub-signature-256`.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WA_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && verifyToken && token === verifyToken) {
    return new Response(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  // Read raw body for eventual signature verification
  const rawBody = await req.text();

  try {
    const json = JSON.parse(rawBody);
    // eslint-disable-next-line no-console
    console.log(
      '[BISOU] WhatsApp webhook received:',
      JSON.stringify(json).slice(0, 500),
    );
  } catch {
    // eslint-disable-next-line no-console
    console.warn('[BISOU] WhatsApp webhook received non-JSON body');
  }

  // Always ack 200 so Meta doesn't retry
  return NextResponse.json({ ok: true });
}
