import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/me.ts';
import { resetJwksCache } from '../../api/_lib/auth.ts';
import { installJwksFixture, SUPABASE_URL, USER_ID, type Fixture } from '../helpers/jwt.ts';

let jwks: Fixture;

beforeEach(async () => {
  vi.stubEnv('SUPABASE_URL', SUPABASE_URL);
  vi.stubEnv('VITE_SUPABASE_URL', SUPABASE_URL);
  resetJwksCache();
  jwks = await installJwksFixture();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const request = (headers: Record<string, string> = {}) =>
  new Request('https://sf.iscanngroup.com/api/me', { headers });

describe('GET /api/me', () => {
  it('returns the caller identity for a valid token', async () => {
    const res = await GET(request({ Authorization: `Bearer ${await jwks.sign()}` }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      id: USER_ID,
      email: 'kent@example.com',
      tier: 0,
      status: 'none',
    });
  });

  it('reports tier 0 / none until Phase 3 wires Stripe', async () => {
    const res = await GET(request({ Authorization: `Bearer ${await jwks.sign()}` }));
    const body = await res.json();
    expect(body.tier).toBe(0);
    expect(body.status).toBe('none');
  });

  it('401s with no Authorization header', async () => {
    const res = await GET(request());
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('401s on a garbage token', async () => {
    const res = await GET(request({ Authorization: 'Bearer garbage' }));
    expect(res.status).toBe(401);
  });

  it('401s on an expired token', async () => {
    const res = await GET(request({ Authorization: `Bearer ${await jwks.sign({ expiresIn: '-5m' })}` }));
    expect(res.status).toBe(401);
  });

  it('never reveals why the token was rejected', async () => {
    // The reason is logged server-side; leaking it lets an attacker distinguish
    // "expired" from "forged", which speeds up probing.
    const res = await GET(request({ Authorization: 'Bearer garbage' }));
    const text = await res.text();
    expect(text).not.toMatch(/expired|signature|claim|subject/i);
  });

  it('trusts the token subject, not a client-supplied user id', async () => {
    const res = await GET(
      request({
        Authorization: `Bearer ${await jwks.sign({ sub: USER_ID })}`,
        'X-User-Id': 'attacker-controlled-id',
      })
    );
    const body = await res.json();
    expect(body.id).toBe(USER_ID);
  });
});
