import { NextResponse } from 'next/server';

/**
 * src/app/api/webhooks/whatsapp/route.ts
 * Ingests WhatsApp Cloud API delivery receipts, status updates, and challenge verification.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // Ingest delivery status timestamps for metrics tracking
    return NextResponse.json({ status: 'received', payload });
  } catch {
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 400 });
  }
}

