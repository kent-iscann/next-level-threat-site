/**
 * GET /api/manifest — server-side proxy for the free Watch Report manifest.
 *
 * The SPA calls the origin manifest URL directly and falls back to this route,
 * so it exists to survive CORS or network failures against the bucket. Once the
 * manifest moves to Supabase Storage this only needs its env var repointed.
 */
import { corsHeaders, jsonError } from './_lib/http.js';
import { optionalEnv } from './_lib/env.js';

const DEFAULT_MANIFEST_URL =
  'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/manifest.json';

const UPSTREAM_TIMEOUT_MS = 10_000;

export async function GET(request: Request): Promise<Response> {
  const cors = corsHeaders(request);
  const manifestUrl = optionalEnv('WATCH_REPORTS_MANIFEST_URL', DEFAULT_MANIFEST_URL);

  let upstream: Response;
  try {
    upstream = await fetch(manifestUrl, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    console.error('[manifest] upstream unreachable:', (err as Error).message);
    return merge(jsonError('Failed to fetch manifest', 502), cors);
  }

  if (!upstream.ok) {
    console.error('[manifest] upstream returned', upstream.status);
    return merge(jsonError('Failed to fetch manifest', 502), cors);
  }

  const text = await upstream.text();

  // Only forward bodies that actually parse. A bucket 404 page served as HTML
  // would otherwise reach the client mislabelled as JSON and fail deep in the UI.
  try {
    JSON.parse(text);
  } catch {
    console.error('[manifest] upstream body was not valid JSON');
    return merge(jsonError('Manifest is not valid JSON', 502), cors);
  }

  return new Response(text, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      ...cors,
    },
  });
}

function merge(response: Response, headers: Record<string, string>): Response {
  if (Object.keys(headers).length === 0) return response;
  const merged = new Headers(response.headers);
  for (const [k, v] of Object.entries(headers)) merged.set(k, v);
  return new Response(response.body, { status: response.status, headers: merged });
}
