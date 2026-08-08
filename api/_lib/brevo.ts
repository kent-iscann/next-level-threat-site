/**
 * Minimal Brevo REST client.
 *
 * The @getbrevo/brevo SDK is a heavy Node-only wrapper around these two calls;
 * plain fetch keeps the function bundle small and works on any runtime.
 */

const BREVO_BASE = 'https://api.brevo.com/v3';

export type BrevoResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number; message: string };

async function brevoFetch(
  path: string,
  apiKey: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<BrevoResult> {
  const { timeoutMs = 10_000, ...rest } = init;

  let response: Response;
  try {
    response = await fetch(`${BREVO_BASE}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        ...(rest.headers ?? {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    return {
      ok: false,
      status: timedOut ? 504 : 502,
      message: timedOut ? 'Brevo request timed out' : 'Could not reach Brevo',
    };
  }

  // 204 No Content is a success for list mutations and has no body to parse.
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : null) ?? 'Brevo request failed';
    return { ok: false, status: response.status, message };
  }

  return { ok: true, data };
}

/**
 * Creates or updates a contact and ensures it belongs to `listIds`.
 * `updateEnabled` makes a repeat subscribe idempotent rather than a 400.
 */
export function upsertContact(
  params: { email: string; listIds: number[]; attributes?: Record<string, unknown> },
  apiKey: string
): Promise<BrevoResult> {
  return brevoFetch('/contacts', apiKey, {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      listIds: params.listIds,
      attributes: params.attributes,
      updateEnabled: true,
    }),
  });
}

/** Used in Phase 6 when a PRO subscription lapses. */
export function removeContactFromList(
  email: string,
  listId: number,
  apiKey: string
): Promise<BrevoResult> {
  return brevoFetch(`/contacts/lists/${listId}/contacts/remove`, apiKey, {
    method: 'POST',
    body: JSON.stringify({ emails: [email] }),
  });
}
