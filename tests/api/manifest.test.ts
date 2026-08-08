import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/manifest.ts';

const DEFAULT_URL =
  'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/manifest.json';

const SAMPLE_MANIFEST = [
  { topic: 'Kazakhstan Economy', slug: 'kazakhstan-economy', reports: [] },
];

function getRequest(headers: Record<string, string> = {}) {
  return new Request('https://sf.iscanngroup.com/api/manifest', { method: 'GET', headers });
}

function mockUpstream(body: string, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv('WATCH_REPORTS_MANIFEST_URL', '');
  vi.stubEnv('ALLOWED_ORIGINS', '');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('GET /api/manifest', () => {
  it('proxies the upstream manifest with a JSON content type', async () => {
    mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    const res = await GET(getRequest());

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    await expect(res.json()).resolves.toEqual(SAMPLE_MANIFEST);
  });

  it('sets a 5 minute cache header', async () => {
    mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    const res = await GET(getRequest());
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300');
  });

  it('falls back to the R2 URL when the env var is unset', async () => {
    const fetchMock = mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    await GET(getRequest());
    expect(fetchMock.mock.calls[0][0]).toBe(DEFAULT_URL);
  });

  it('uses WATCH_REPORTS_MANIFEST_URL when set — the Supabase cutover switch', async () => {
    const supabaseUrl = 'https://xyz.supabase.co/storage/v1/object/public/watch-reports/manifest.json';
    vi.stubEnv('WATCH_REPORTS_MANIFEST_URL', supabaseUrl);
    const fetchMock = mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    await GET(getRequest());
    expect(fetchMock.mock.calls[0][0]).toBe(supabaseUrl);
  });
});

describe('GET /api/manifest — upstream failures', () => {
  it('returns 502 when the bucket 404s', async () => {
    mockUpstream('Not Found', 404);
    const res = await GET(getRequest());
    expect(res.status).toBe(502);
  });

  it('returns 502 when the bucket 500s', async () => {
    mockUpstream('boom', 500);
    const res = await GET(getRequest());
    expect(res.status).toBe(502);
  });

  it('returns 502 when the upstream is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const res = await GET(getRequest());
    expect(res.status).toBe(502);
  });

  it('rejects a 200 response whose body is not JSON', async () => {
    // A bucket misconfiguration that serves an HTML error page with status 200
    // would otherwise reach the SPA mislabelled as JSON.
    mockUpstream('<!DOCTYPE html><html><body>Error</body></html>');
    const res = await GET(getRequest());
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({ error: 'Manifest is not valid JSON' });
  });

  it('does not leak the upstream URL in the error body', async () => {
    mockUpstream('Not Found', 404);
    const res = await GET(getRequest());
    expect(await res.text()).not.toContain('r2.dev');
  });
});

describe('GET /api/manifest — CORS', () => {
  it('no longer sends a wildcard origin', async () => {
    mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    const res = await GET(getRequest({ origin: 'https://anywhere.example' }));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('echoes an allowlisted origin', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://partner.example');
    mockUpstream(JSON.stringify(SAMPLE_MANIFEST));
    const res = await GET(getRequest({ origin: 'https://partner.example' }));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://partner.example');
  });
});
