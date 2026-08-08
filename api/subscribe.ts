/**
 * POST /api/subscribe — adds an email to the free Brevo newsletter list.
 *
 * Ported from the Cloudflare Worker. Behavioural changes from the original:
 *   - the API key comes from an unprefixed server env var, not `VITE_*`
 *   - the email is validated and normalised before a Brevo call is spent
 *   - the Brevo error body is no longer echoed to the client
 */
import { corsHeaders, json, jsonError, badRequest, serverError } from './_lib/http.ts';
import { optionalEnv, requireEnv, MissingEnvError } from './_lib/env.ts';
import { isValidEmail, normalizeEmail, readJson } from './_lib/validation.ts';
import { upsertContact } from './_lib/brevo.ts';

const DEFAULT_FREE_LIST_ID = 3;

export async function POST(request: Request): Promise<Response> {
  const cors = corsHeaders(request);

  const body = await readJson(request);
  if (!body) return withHeaders(badRequest('Invalid JSON body'), cors);

  const { email } = body;
  if (!isValidEmail(email)) {
    return withHeaders(badRequest('A valid email is required'), cors);
  }

  let apiKey: string;
  let listId: number;
  try {
    apiKey = requireEnv('BREVO_API_KEY');
    listId = parseListId(optionalEnv('BREVO_FREE_LIST_ID', String(DEFAULT_FREE_LIST_ID)));
  } catch (err) {
    // Misconfiguration is our fault, not the caller's — log it, stay vague publicly.
    console.error('[subscribe] configuration error:', (err as Error).message);
    if (err instanceof MissingEnvError) return withHeaders(serverError(), cors);
    throw err;
  }

  const result = await upsertContact(
    { email: normalizeEmail(email), listIds: [listId] },
    apiKey
  );

  if (!result.ok) {
    console.error('[subscribe] Brevo error', result.status, result.message);
    // Brevo's own message can name the list or account; surface a generic string
    // and map upstream 4xx to 502 so clients cannot probe Brevo through us.
    const status = result.status >= 500 || result.status === 429 ? result.status : 502;
    return withHeaders(jsonError('Unable to subscribe at this time.', status), cors);
  }

  return withHeaders(json({ success: true }), cors);
}

export function OPTIONS(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function parseListId(raw: string): number {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new MissingEnvError(`BREVO_FREE_LIST_ID (expected a positive integer, got "${raw}")`);
  }
  return parsed;
}

function withHeaders(response: Response, headers: Record<string, string>): Response {
  if (Object.keys(headers).length === 0) return response;
  const merged = new Headers(response.headers);
  for (const [k, v] of Object.entries(headers)) merged.set(k, v);
  return new Response(response.body, { status: response.status, headers: merged });
}
