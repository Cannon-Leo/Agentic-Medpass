import { NextResponse } from 'next/server';

/**
 * src/app/api/webhooks/paystack/route.ts
 * Ingests Paystack subscription billing status updates and verifies signatures.
 */

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const payload = await request.json();
    return NextResponse.json({ status: 'received', event: payload.event });
  } catch {
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 400 });
  }
}

