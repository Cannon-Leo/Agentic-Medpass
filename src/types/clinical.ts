import { z } from 'zod';

export const clinicalExtractionSchema = z.object({
  patientName: z.string().min(1),
  phoneNumber: z.string().min(10),
  patientBirthYear: z.number().int().min(1900).max(new Date().getFullYear()),
  drugName: z.string().min(1),
  dose: z.string().min(1),
  frequency: z.string().min(1),
  durationMonths: z.number().int().positive(),
  totalRefills: z.number().int().nonnegative(),
  pharmacyName: z.string().min(1),
  storageNotes: z.string().min(1),
  missingFields: z.array(z.string()),
});

export type ClinicalExtraction = z.infer<typeof clinicalExtractionSchema>;

export type PrescriptionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'ISSUED'
  | 'COLLECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type RefillStatus = 'PENDING' | 'DISPENSED' | 'CANCELLED';

