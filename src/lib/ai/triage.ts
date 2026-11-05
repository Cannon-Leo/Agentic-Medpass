/**
 * src/lib/ai/triage.ts
 * Deterministic emergency triage used before any semantic retrieval.
 * Rules: rules/ai.md Section 2.
 */

const ACUTE_SYMPTOMS =
  /\b(chest pain|shortness of breath|cannot breathe|swollen tongue|swollen throat|fainted|anaphylaxis|severe rash|passed out)\b/i;

const NEGATION_PATTERNS =
  /\b(no|not|never|don't|do not|without)\s+(having\s+)?(chest pain|shortness of breath|swollen tongue|swollen throat|trouble breathing)\b/i;

export function evaluateEmergencyTriage(input: string): 'EMERGENCY' | 'SAFE' {
  if (NEGATION_PATTERNS.test(input)) {
    return 'SAFE';
  }
  if (ACUTE_SYMPTOMS.test(input)) {
    return 'EMERGENCY';
  }
  return 'SAFE';
}
