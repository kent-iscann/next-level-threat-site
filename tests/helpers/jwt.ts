/** Shared ES256 token fixtures. Imported by tests, never collected as one. */
import { SignJWT, generateKeyPair, exportJWK, type JWK } from 'jose';
import { vi } from 'vitest';

export const SUPABASE_URL = 'https://test-project.supabase.co';
export const ISSUER = `${SUPABASE_URL}/auth/v1`;
export const KID = 'test-key-1';
export const USER_ID = '3f7c1b90-0000-4000-8000-abcdefabcdef';

export type Fixture = {
  publicJwk: JWK;
  sign: (claims?: { sub?: string; email?: string; expiresIn?: string }) => Promise<string>;
};

/** Generates a key pair and stubs global fetch to serve the matching JWKS. */
export async function installJwksFixture(): Promise<Fixture> {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true });
  const publicJwk: JWK = {
    ...(await exportJWK(publicKey)),
    kid: KID,
    alg: 'ES256',
    use: 'sig',
  };

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

  return {
    publicJwk,
    sign: ({ sub = USER_ID, email = 'kent@example.com', expiresIn = '1h' } = {}) =>
      new SignJWT({ email, role: 'authenticated' })
        .setProtectedHeader({ alg: 'ES256', kid: KID })
        .setIssuer(ISSUER)
        .setAudience('authenticated')
        .setSubject(sub)
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(privateKey),
  };
}
