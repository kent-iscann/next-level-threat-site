import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.'
  );
}

/**
 * Browser Supabase client. Only ever holds the publishable (anon) key — every
 * privileged operation goes through /api, which uses the secret key server-side.
 *
 * Sign-in is 6-digit code only, so there is no callback URL to parse:
 * detectSessionInUrl is off. This sidesteps the two failure modes that hit
 * corporate mailboxes hardest — link scanners consuming single-use magic links,
 * and PKCE breaking when a link opens in a different browser than requested it.
 */
export const supabase = createClient(url, anonKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
});
