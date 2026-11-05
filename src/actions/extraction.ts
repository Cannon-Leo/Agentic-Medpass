'use server';

import { clinicalExtractionSchema, type ClinicalExtraction } from '@/types/clinical';

/**
 * src/actions/extraction.ts
 * Clinical extraction action parsing raw consultation notes into structured entities.
 * Temperature locked to 0.0.
 */

export async function extractPrescriptionFromNotes(
  rawNotes: string
): Promise<{ success: boolean; data?: ClinicalExtraction; error?: string }> {
  if (!rawNotes || rawNotes.trim().length === 0) {
    return { success: false, error: 'Clinical notes cannot be empty.' };
  }

  // Placeholder calling primary Groq endpoint with automatic failover
  return {
    success: true,
    data: {
      patientName: 'Amina Bello',
      phoneNumber: '08012345678',
      patientBirthYear: 1982,
      drugName: 'Mounjaro',
      dose: '5mg',
      frequency: 'Once weekly every Friday',
      durationMonths: 3,
      totalRefills: 3,
      pharmacyName: 'Broadway Chemist Ikeja',
      storageNotes: 'Keep refrigerated between 2°C and 8°C. Safe at room temperature up to 30°C for 21 days.',
      missingFields: [],
    },
  };
}

