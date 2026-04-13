/**
 * POST /api/pixel/track
 * ----------------------
 * Server-side Meta Conversions API endpoint.
 * Receives events from the browser (after Pixel fires) and forwards them
 * server-side to improve match rate and handle ad-block.
 *
 * Deduplication: the browser Pixel and this endpoint use the same `eventId`
 * so Meta only counts one conversion.
 *
 * Accepted events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
 */

import { NextResponse, type NextRequest } from 'next/server';
import { sendCAPIEvent } from '@/lib/meta-capi';
import type { CAPIEventName, CAPIUserData, CAPICustomData } from '@/lib/meta-capi';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_EVENTS: CAPIEventName[] = [
  'PageView',
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
];

const trackSchema = z.object({
  eventName: z.enum(['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase']),
  eventId: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  userData: z
    .object({
      em: z.string().optional(),
      ph: z.string().optional(),
      fn: z.string().optional(),
      ln: z.string().optional(),
      fbc: z.string().optional(),
      fbp: z.string().optional(),
    })
    .optional(),
  customData: z
    .object({
      currency: z.string().optional(),
      value: z.number().optional(),
      contentIds: z.array(z.string()).optional(),
      contentName: z.string().optional(),
      contentType: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
  }

  const { eventName, eventId, sourceUrl, userData, customData } = parsed.data;

  if (!ALLOWED_EVENTS.includes(eventName)) {
    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 });
  }

  const capiUser: CAPIUserData = {
    em: userData?.em ? [userData.em] : undefined,
    ph: userData?.ph ? [userData.ph] : undefined,
    fn: userData?.fn ? [userData.fn] : undefined,
    ln: userData?.ln ? [userData.ln] : undefined,
    fbc: userData?.fbc,
    fbp: userData?.fbp,
    client_ip_address:
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
    client_user_agent: req.headers.get('user-agent') ?? undefined,
  };

  const capiCustomData: CAPICustomData | undefined = customData
    ? {
        currency: 'MAD' as const,
        value: customData.value,
        content_ids: customData.contentIds,
        content_name: customData.contentName,
        content_type: (customData.contentType as 'product' | 'product_group' | undefined) ?? 'product',
      }
    : undefined;

  await sendCAPIEvent({
    event_name: eventName,
    event_id: eventId,
    event_source_url: sourceUrl ?? req.headers.get('referer') ?? undefined,
    user_data: capiUser,
    custom_data: capiCustomData,
  });

  return NextResponse.json({ ok: true });
}
