
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = 3;
const BREVO_CONTACT_URL = 'https://api.brevo.com/v3/contacts';

console.log('Worker initialized with API key:', BREVO_API_KEY ? '***' : 'Not set');

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      return handleSubscribe(request);
    }

    if (url.pathname === '/api/manifest' && request.method === 'GET') {
      return handleManifestProxy();
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleSubscribe(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object' || payload === null) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = (payload as { email?: unknown }).email;

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'A valid email is required' }, { status: 400 });
  }

  if (!BREVO_API_KEY) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const response = await fetch(BREVO_CONTACT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    return Response.json(
      {
        error: responseData?.message ?? 'Brevo request failed',
        details: responseData,
      },
      { status: response.status }
    );
  }

  return Response.json({ success: true, data: responseData });
}

async function handleManifestProxy(): Promise<Response> {
  const MANIFEST_URL = 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/manifest.json';
  try {
    const res = await fetch(MANIFEST_URL, { method: 'GET' });
    const text = await res.text();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    };
    return new Response(text, { status: res.status, headers });
  } catch (err: any) {
    return Response.json({ error: 'Failed to fetch manifest proxy', details: String(err) }, { status: 502 });
  }
}
