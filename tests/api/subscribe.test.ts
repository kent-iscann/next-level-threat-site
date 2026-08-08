import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, OPTIONS } from '../../api/subscribe.ts';

function postRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://sf.iscanngroup.com/api/subscribe', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/** Brevo replies 201 with the created contact id. */
function mockBrevoOk() {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ id: 42 }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockBrevoError(status: number, message = 'Contact already exist') {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ code: 'duplicate_parameter', message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv('BREVO_API_KEY', 'test-api-key');
  vi.stubEnv('BREVO_FREE_LIST_ID', '3');
  vi.stubEnv('ALLOWED_ORIGINS', '');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/subscribe — validation', () => {
  it('rejects malformed JSON with 400', async () => {
    const res = await POST(postRequest('{not json'));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid JSON body' });
  });

  it('rejects a missing email with 400', async () => {
    const res = await POST(postRequest({}));
    expect(res.status).toBe(400);
  });

  it('rejects a malformed email with 400', async () => {
    const res = await POST(postRequest({ email: 'not-an-email' }));
    expect(res.status).toBe(400);
  });

  it('rejects a non-string email with 400', async () => {
    const res = await POST(postRequest({ email: 12345 }));
    expect(res.status).toBe(400);
  });

  it('does not call Brevo when validation fails', async () => {
    const fetchMock = mockBrevoOk();
    await POST(postRequest({ email: 'nope' }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/subscribe — configuration', () => {
  it('returns 500 when BREVO_API_KEY is unset', async () => {
    vi.stubEnv('BREVO_API_KEY', '');
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(500);
  });

  it('returns 500 when the list id is not a positive integer', async () => {
    vi.stubEnv('BREVO_FREE_LIST_ID', 'abc');
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(500);
  });

  it('never leaks the API key in the response body', async () => {
    mockBrevoError(400);
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(await res.text()).not.toContain('test-api-key');
  });
});

describe('POST /api/subscribe — success path', () => {
  it('returns 200 on success', async () => {
    mockBrevoOk();
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
  });

  it('sends a normalised email, the list id, and updateEnabled to Brevo', async () => {
    const fetchMock = mockBrevoOk();
    await POST(postRequest({ email: '  Kent@Example.COM  ' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    expect(init.method).toBe('POST');
    expect(init.headers['api-key']).toBe('test-api-key');
    expect(JSON.parse(init.body)).toMatchObject({
      email: 'kent@example.com',
      listIds: [3],
      updateEnabled: true,
    });
  });

  it('honours a custom BREVO_FREE_LIST_ID', async () => {
    vi.stubEnv('BREVO_FREE_LIST_ID', '9');
    const fetchMock = mockBrevoOk();
    await POST(postRequest({ email: 'kent@example.com' }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).listIds).toEqual([9]);
  });
});

describe('POST /api/subscribe — upstream failures', () => {
  it('maps a Brevo 4xx to 502 so clients cannot probe Brevo through us', async () => {
    mockBrevoError(400);
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(502);
  });

  it('does not echo the Brevo error message to the client', async () => {
    mockBrevoError(400, 'Contact already exist in list 3');
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    const body = await res.json();
    expect(body.error).toBe('Unable to subscribe at this time.');
    expect(JSON.stringify(body)).not.toContain('list 3');
  });

  it('passes through a 429 so the client can back off', async () => {
    mockBrevoError(429, 'Too many requests');
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(429);
  });

  it('passes through upstream 5xx', async () => {
    mockBrevoError(503, 'Service unavailable');
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(503);
  });

  it('returns 504 when the Brevo call times out', async () => {
    const timeout = Object.assign(new Error('The operation timed out'), {
      name: 'TimeoutError',
    });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeout));
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(504);
  });

  it('returns 502 when Brevo is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const res = await POST(postRequest({ email: 'kent@example.com' }));
    expect(res.status).toBe(502);
  });
});

describe('POST /api/subscribe — CORS', () => {
  it('sends no CORS header when ALLOWED_ORIGINS is empty', async () => {
    mockBrevoOk();
    const res = await POST(
      postRequest({ email: 'kent@example.com' }, { origin: 'https://evil.example' })
    );
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('sends no CORS header for an origin outside the allowlist', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://sf.iscanngroup.com');
    mockBrevoOk();
    const res = await POST(
      postRequest({ email: 'kent@example.com' }, { origin: 'https://evil.example' })
    );
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('echoes an allowlisted origin and sets Vary', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://sf.iscanngroup.com,https://other.example');
    mockBrevoOk();
    const res = await POST(
      postRequest({ email: 'kent@example.com' }, { origin: 'https://other.example' })
    );
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://other.example');
    expect(res.headers.get('Vary')).toBe('Origin');
  });

  it('never responds with a wildcard origin', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://sf.iscanngroup.com');
    mockBrevoOk();
    const res = await POST(
      postRequest({ email: 'kent@example.com' }, { origin: 'https://sf.iscanngroup.com' })
    );
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe('*');
  });
});

describe('OPTIONS /api/subscribe', () => {
  it('answers preflight with 204 and the allowed methods', async () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://sf.iscanngroup.com');
    const res = OPTIONS(
      new Request('https://sf.iscanngroup.com/api/subscribe', {
        method: 'OPTIONS',
        headers: { origin: 'https://sf.iscanngroup.com' },
      })
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://sf.iscanngroup.com');
  });
});
