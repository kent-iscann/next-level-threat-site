/** Fake Supabase auth client + render helpers. Imported, never collected. */
import { vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';

export type AuthCallback = (event: string, session: Session | null) => void;

export function makeSession(email = 'kent@example.com'): Session {
  return {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'user-123',
      email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  } as unknown as Session;
}

/**
 * Builds a stand-in for supabase.auth with controllable timing, so tests can
 * assert what renders *before* the initial session lookup resolves.
 */
export function makeFakeSupabase(initialSession: Session | null = null) {
  let listener: AuthCallback | null = null;
  let resolveSession: ((s: Session | null) => void) | null = null;

  const sessionPromise = new Promise<Session | null>((resolve) => {
    resolveSession = resolve;
  });

  // Explicit signatures so `mock.calls[0][0]` is typed and mockResolvedValueOnce
  // can return an error — inference from the happy-path body alone gives
  // `error: null` and a zero-length argument tuple.
  type AuthResult = { data: unknown; error: Error | null };
  type OtpParams = { email: string; options: { emailRedirectTo?: string } };
  type VerifyParams = { email: string; token: string; type: string };

  const auth = {
    getSession: vi.fn(async () => ({ data: { session: await sessionPromise }, error: null })),
    onAuthStateChange: vi.fn((cb: AuthCallback) => {
      listener = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    signInWithOtp: vi.fn(
      async (_params: OtpParams): Promise<AuthResult> => ({ data: {}, error: null })
    ),
    verifyOtp: vi.fn(
      async (_params: VerifyParams): Promise<AuthResult> => ({ data: {}, error: null })
    ),
    signOut: vi.fn(async (): Promise<{ error: Error | null }> => ({ error: null })),
  };

  return {
    client: { auth },
    auth,
    /** Resolves the pending getSession() call. */
    settle: (session: Session | null = initialSession) => resolveSession?.(session),
    /** Pushes an auth state change, as a magic-link exchange would. */
    emit: (event: string, session: Session | null) => listener?.(event, session),
  };
}
