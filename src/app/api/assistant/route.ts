import { NextResponse } from 'next/server';
import { evaluateEmergencyTriage } from '@/lib/ai/triage';

/**
 * src/app/api/assistant/route.ts
 * Grounded patient safety chat endpoint.
 *
 * Implements two-tier clinical guardrails:
 * 1. Deterministic acute symptom regex with negation parsing (src/lib/ai/triage.ts).
 * 2. Grounded pharmacological monograph context resolution with refusal on speculation.
 */

// Verified Mounjaro (Tirzepatide) Monograph Knowledge Chunks (PRD Sections 6 & 9)
const VERIFIED_CHUNKS = [
  {
    topic: 'storage_power',
    keywords: ['power', 'nepa', 'light', 'fridge', 'refrigerator', 'storage', 'temperature', 'spoil', 'keep', 'heat'],
    answer:
      'Verified Storage Rule: Keep your Mounjaro pen in the refrigerator between 2°C and 8°C. If power fails (e.g. NEPA outage), this medicine remains completely safe at room temperature up to 30°C for up to 21 days. Do not freeze.',
  },
  {
    topic: 'dosage_schedule',
    keywords: ['when', 'how', 'take', 'inject', 'schedule', 'friday', 'missed', 'food'],
    answer:
      'Verified Dosage Rule: Inject 1 dose (5mg) subcutaneously under the skin once weekly every Friday morning, with or without food. Rotate injection sites between your abdomen, thigh, or upper arm.',
  },
  {
    topic: 'interactions',
    keywords: ['paracetamol', 'panadol', 'headache', 'painkiller', 'tylenol', 'aspirin'],
    answer:
      'Verified Interaction Note: Paracetamol (Panadol) has no documented adverse interactions with Mounjaro and can be taken for mild headache or body aches according to package directions.',
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = typeof body.query === 'string' ? body.query.trim() : '';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Step 1: Emergency Guardrail Triage
    const triage = evaluateEmergencyTriage(query);
    if (triage === 'EMERGENCY') {
      return NextResponse.json({
        status: 'EMERGENCY',
        message:
          'EMERGENCY: Stop this medicine immediately. Seek urgent medical attention or call emergency services now.',
        action: 'LOCK_INPUT',
      });
    }

    // Step 2: Monograph Retrieval Scoping (Matching Verified Drug Chunks)
    const lower = query.toLowerCase();
    const match = VERIFIED_CHUNKS.find((chunk) =>
      chunk.keywords.some((kw) => lower.includes(kw))
    );

    if (match) {
      return NextResponse.json({
        status: 'SAFE',
        answer: match.answer,
        refuseSpeculation: false,
      });
    }

    // Step 3: Out-of-bounds Query Refusal (Strict Zero Speculation Policy)
    return NextResponse.json({
      status: 'SAFE',
      answer:
        'This information is not in your approved record. Do not guess with your medicine. Please call your clinic directly at +234 801 234 5678.',
      refuseSpeculation: true,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
