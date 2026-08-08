/**
 * Server-side Supabase JWT verification.
 *
 * The project signs access tokens with ES256 and publishes the public key at
 * /auth/v1/.well-known/jwks.json, so verification is local: no network call to
 * Supabase per request, no service key involved. jose caches the key set and
 * refetches only on key rotation.
 *
 * Never use supabase.auth.getUser() for this — it costs a round trip on every
 * single request.
 */
import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from 'jose';
import { optionalEnv, requireEnv } from './env.ts';

export type AuthenticatedUser = {
  id: string;
  email: string | null;
  /** Supabase role claim, `authenticated` for a signed-in user. */
  role: string | null;
};

export class UnauthorizedError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(`Unauthorized: ${reason}`);
    this.name = 'UnauthorizedError';
    this.reason = reason;
  }
}

function supabaseUrl(): string {
  // SUPABASE_URL is preferred; VITE_SUPABASE_URL is the same public value and
  // is what already exists in .env, so accept either.
  const fromServer = optionalEnv('SUPABASE_URL', '');
  return (fromServer || requireEnv('VITE_SUPABASE_URL')).replace(/\/+$/, '');
}

let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let cachedForUrl: string | null = null;

function jwks(url: string) {
  if (!cachedJwks || cachedForUrl !== url) {
    cachedJwks = createRemoteJWKSet(new URL(`${url}/auth/v1/.well-known/jwks.json`));
    cachedForUrl = url;
  }
  return cachedJwks;
}

/** Test seam: drops the memoised key set between cases. */
export function resetJwksCache(): void {
  cachedJwks = null;
  cachedForUrl = null;
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const [scheme, ...rest] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer') return null;
  const token = rest.join(' ').trim();
  return token.length > 0 ? token : null;
}

/**
 * Verifies the Bearer token and returns its subject.
 * Throws UnauthorizedError for anything that is not a valid, unexpired token.
 */
export async function requireUser(request: Request): Promise<AuthenticatedUser> {
  const token = bearerToken(request);
  if (!token) throw new UnauthorizedError('missing bearer token');

  const url = supabaseUrl();

  let payload;
  try {
    ({ payload } = await jwtVerify(token, jwks(url), {
      issuer: `${url}/auth/v1`,
      audience: 'authenticated',
      algorithms: ['ES256'],
    }));
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) throw new UnauthorizedError('token expired');
    if (err instanceof joseErrors.JWTClaimValidationFailed) {
      throw new UnauthorizedError(`claim rejected: ${err.claim}`);
    }
    throw new UnauthorizedError('token signature invalid');
  }

  if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
    throw new UnauthorizedError('token has no subject');
  }

  return {
    id: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : null,
    role: typeof payload.role === 'string' ? payload.role : null,
  };
}
