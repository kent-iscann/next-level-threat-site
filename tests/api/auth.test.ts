import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignJWT, generateKeyPair, exportJWK, type JWK } from 'jose';
import {
  requireUser,
  bearerToken,
  resetJwksCache,
  UnauthorizedError,
} from '../../api/_lib/auth.ts';

const SUPABASE_URL = 'https://test-project.supabase.co';
const ISSUER = `${SUPABASE_URL}/auth/v1`;
const KID = 'test-key-1';
const USER_ID = '3f7c1b90-0000-4000-8000-abcdefabcdef';

let signingKey: CryptoKey;
let publicJwk: JWK;
/** A key the server does NOT publish — used to forge signatures. */
let attackerKey: CryptoKey;

beforeEach(async () => {
  vi.stubEnv('SUPABASE_URL', SUPABASE_URL);
  vi.stubEnv('VITE_SUPABASE_URL', SUPABASE_URL);
  resetJwksCache();

  const pair = await generateKeyPair('ES256', { extractable: true });
  signingKey = pair.privateKey;
  publicJwk = { ...(await exportJWK(pair.publicKey)), kid: KID, alg: 'ES256', use: 'sig' };

  const attackerPair = await generateKeyPair('ES256', { extractable: true });
  attackerKey = attackerPair.privateKey;

  // Serve the JWKS the way Supabase does.
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL) => {
      if (String(input).includes('/.well-known/jwks.json')) {
        return new Response(JSON.stringify({ keys: [publicJwk] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`unexpected fetch: ${input}`);
    })
  );

  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

type TokenOpts = {
  sub?: string | null;
  issuer?: string;
  audience?: string;
  expiresIn?: string | number;
  key?: CryptoKey;
  email?: string;
};

async function makeToken(opts: TokenOpts = {}): Promise<string> {
  const jwt = new SignJWT({
    email: opts.email ?? 'kent@example.com',
    role: 'authenticated',
  })
    .setProtectedHeader({ alg: 'ES256', kid: KID })
    .setIssuer(opts.issuer ?? ISSUER)
    .setAudience(opts.audience ?? 'authenticated')
    .setIssuedAt()
    .setExpirationTime(opts.expiresIn ?? '1h');

  if (opts.sub !== null) jwt.setSubject(opts.sub ?? USER_ID);
  return jwt.sign(opts.key ?? signingKey);
}

const withToken = (token: string) =>
  new Request('https://sf.iscanngroup.com/api/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

describe('bearerToken', () => {
  it('extracts a bearer token', () => {
    expect(bearerToken(withToken('abc.def.ghi'))).toBe('abc.def.ghi');
  });

  it('is case-insensitive on the scheme', () => {
    const req = new Request('https://x.test/', { headers: { Authorization: 'BEARER tok' } });
    expect(bearerToken(req)).toBe('tok');
  });

  it('returns null with no Authorization header', () => {
    expect(bearerToken(new Request('https://x.test/'))).toBeNull();
  });

  it('returns null for a non-bearer scheme', () => {
    const req = new Request('https://x.test/', { headers: { Authorization: 'Basic abc' } });
    expect(bearerToken(req)).toBeNull();
  });

  it('returns null for an empty bearer value', () => {
    const req = new Request('https://x.test/', { headers: { Authorization: 'Bearer   ' } });
    expect(bearerToken(req)).toBeNull();
  });
});

describe('requireUser — accepts valid tokens', () => {
  it('returns the subject, email and role', async () => {
    const user = await requireUser(withToken(await makeToken()));
    expect(user).toEqual({
      id: USER_ID,
      email: 'kent@example.com',
      role: 'authenticated',
    });
  });

  it('tolerates a token with no email claim', async () => {
    const token = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'ES256', kid: KID })
      .setIssuer(ISSUER)
      .setAudience('authenticated')
      .setSubject(USER_ID)
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(signingKey);
    const user = await requireUser(withToken(token));
    expect(user.email).toBeNull();
  });

  it('fetches the JWKS only once across repeated verifications', async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    await requireUser(withToken(await makeToken()));
    await requireUser(withToken(await makeToken()));
    await requireUser(withToken(await makeToken()));
    expect(fetchMock.mock.calls.length).toBe(1);
  });
});

describe('requireUser — rejects invalid tokens', () => {
  it('rejects a missing Authorization header', async () => {
    await expect(requireUser(new Request('https://x.test/'))).rejects.toThrow(UnauthorizedError);
  });

  it('rejects a structurally invalid token', async () => {
    await expect(requireUser(withToken('not-a-jwt'))).rejects.toThrow(UnauthorizedError);
  });

  it('rejects an expired token', async () => {
    const token = await makeToken({ expiresIn: '-1h' });
    await expect(requireUser(withToken(token))).rejects.toThrow(/expired/);
  });

  it('rejects a token from the wrong issuer', async () => {
    const token = await makeToken({ issuer: 'https://evil.supabase.co/auth/v1' });
    await expect(requireUser(withToken(token))).rejects.toThrow(/claim rejected/);
  });

  it('rejects a token with the wrong audience', async () => {
    const token = await makeToken({ audience: 'anon' });
    await expect(requireUser(withToken(token))).rejects.toThrow(/claim rejected/);
  });

  it('rejects a token signed by a key that is not in the JWKS', async () => {
    const token = await makeToken({ key: attackerKey });
    await expect(requireUser(withToken(token))).rejects.toThrow(UnauthorizedError);
  });

  it('rejects a token with no subject', async () => {
    const token = await makeToken({ sub: null });
    await expect(requireUser(withToken(token))).rejects.toThrow(/no subject/);
  });
});

describe('requireUser — algorithm confusion', () => {
  it('rejects an HS256 token even when the payload claims are correct', async () => {
    // Classic attack: sign with a symmetric algorithm and hope the verifier
    // accepts whatever `alg` the header declares. Pinning algorithms prevents it.
    const secret = new TextEncoder().encode('a'.repeat(64));
    const token = await new SignJWT({ email: 'attacker@example.com', role: 'authenticated' })
      .setProtectedHeader({ alg: 'HS256', kid: KID })
      .setIssuer(ISSUER)
      .setAudience('authenticated')
      .setSubject(USER_ID)
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    await expect(requireUser(withToken(token))).rejects.toThrow(UnauthorizedError);
  });

  it('rejects an unsigned (alg: none) token', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: USER_ID,
        iss: ISSUER,
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString('base64url');

    await expect(requireUser(withToken(`${header}.${payload}.`))).rejects.toThrow(
      UnauthorizedError
    );
  });
});
