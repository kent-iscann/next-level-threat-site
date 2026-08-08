/**
 * Response helpers shared by the Vercel Functions in /api.
 *
 * Files under api/ whose name starts with `_` are not routed by Vercel, so this
 * directory is a safe home for server-only code.
 */

export type JsonBody = Record<string, unknown> | unknown[];

/** Origins permitted to call the API cross-origin. Same-origin calls from the
 *  SPA never need these headers; this exists only for external consumers. */
export function allowedOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * Returns CORS headers only when the caller's origin is explicitly allowlisted.
 * An unknown origin gets no CORS headers at all, which the browser treats as a
 * denial — the previous Worker sent `Access-Control-Allow-Origin: *`.
 */
export function corsHeaders(
  request: Request,
  env: NodeJS.ProcessEnv = process.env
): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins(env).includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
  };
}

export function json(
  body: JsonBody,
  init: { status?: number; headers?: Record<string, string> } = {}
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
}

export function jsonError(
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return json({ error: message, ...extra }, { status });
}

export const badRequest = (m = 'Bad request') => jsonError(m, 400);
export const methodNotAllowed = (allow: string) =>
  json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: allow } });
/** Never include upstream exception text here — it can leak keys and hostnames. */
export const serverError = (m = 'Server configuration error') => jsonError(m, 500);
