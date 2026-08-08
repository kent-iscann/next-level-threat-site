/** Input validation shared across API routes. */

// Deliberately permissive: the goal is to reject obvious junk before spending a
// Brevo API call, not to fully validate RFC 5322. Delivery is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Max length per RFC 5321 §4.5.3.1. */
export const MAX_EMAIL_LENGTH = 254;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: unknown): raw is string {
  if (typeof raw !== 'string') return false;
  const email = normalizeEmail(raw);
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

/** Reads a JSON body, returning null rather than throwing on malformed input. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}
