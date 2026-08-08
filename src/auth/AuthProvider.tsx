import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuthState = {
  session: Session | null;
  user: User | null;
  /** True until the initial session lookup settles. Guards against a redirect
   *  to /login flashing before a stored session is restored. */
  loading: boolean;
  signInWithEmail: (email: string, redirectTo?: string) => Promise<void>;
  verifyOtpCode: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Fires for SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED and the PKCE exchange
    // that detectSessionInUrl performs when the magic-link callback loads.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      async signInWithEmail(email, redirectTo) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo:
              redirectTo ?? `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      },
      async verifyOtpCode(email, token) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });
        if (error) throw error;
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/**
 * Access token for calling /api. Reads through the client so a token that
 * expired while the tab sat idle is refreshed rather than sent stale.
 */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
