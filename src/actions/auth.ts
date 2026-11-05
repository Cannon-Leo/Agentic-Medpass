'use server';

/**
 * src/actions/auth.ts
 * Authentication actions for Owner PIN verification and Pharmacy Magic Links.
 */

export async function verifyOwnerPin(clinicId: string, pin: string) {
  // Enforces 4-digit numeric format
  if (!/^\d{4}$/.test(pin)) {
    return { success: false, error: 'PIN must be exactly 4 digits.' };
  }
  // Placeholder for cryptographic hash comparison against Clinic.ownerPinHash
  return { success: true };
}

export async function requestDispenserMagicLink(phoneNumber: string) {
  // Placeholder for WhatsApp single-use magic link generation and dispatch
  return { success: true, message: 'Magic link dispatched via WhatsApp.' };
}

