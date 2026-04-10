/**
 * POST /api/webhooks/upconfirm
 * ----------------------------
 * Callback endpoint called by UpConfirm when an order reaches a terminal
 * state (confirmed / refused / unreachable / cancelled).
 *
 * Security: HMAC-SHA-256 signature in `x-upconfirm-signature` header.
 *
 * Idempotency: never overwrites a statut that is already a terminal
 * post-confirmation value (`delivered`, `refused`) — prevents UpConfirm
 * replays from erasing ground-truth state tracked by our logistics team.
 */

import { NextResponse, type NextRequest } from 'next/server';

import { getPayloadClient } from '@/lib/payload';
import {
  mapUpConfirmStatus,
  verifyUpConfirmSignature,
  type UpConfirmWebhookPayload,
} from '@/lib/upconfirm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TERMINAL_STATUTS = new Set(['delivered', 'refused']);

export async function POST(req: NextRequest) {
  // 1. Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get('x-upconfirm-signature');

  if (!verifyUpConfirmSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 },
    );
  }

  // 2. Parse payload
  let payloadJson: UpConfirmWebhookPayload;
  try {
    payloadJson = JSON.parse(rawBody) as UpConfirmWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { external_id, status } = payloadJson;
  if (!external_id || !status) {
    return NextResponse.json(
      { error: 'Missing external_id or status' },
      { status: 400 },
    );
  }

  const nextStatut = mapUpConfirmStatus(status);
  if (!nextStatut) {
    // Unreachable / pending → no-op, ack the webhook so UpConfirm stops retrying
    return NextResponse.json({ ok: true, skipped: true });
  }

  // 3. Lookup + update the order (idempotent)
  try {
    const payload = await getPayloadClient();

    const res = await payload.find({
      collection: 'orders',
      where: { orderId: { equals: external_id } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    if (!doc) {
      return NextResponse.json(
        { error: `Order ${external_id} not found` },
        { status: 404 },
      );
    }

    // Idempotence: never overwrite a terminal statut
    if (doc.statut && TERMINAL_STATUTS.has(String(doc.statut))) {
      return NextResponse.json({ ok: true, skipped: 'terminal_state' });
    }

    await payload.update({
      collection: 'orders',
      id: doc.id,
      data: { statut: nextStatut, source: 'upconfirm' },
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true, orderId: external_id, statut: nextStatut });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[BISOU] UpConfirm webhook failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
