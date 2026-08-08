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
 */
export const supabase = createClient(url, anonKey, {
  auth: {
    // PKCE keeps the one-time code useless to anyone who intercepts the email,
    // at the cost of requiring the link to open in the same browser that
    // requested it. See docs/auth.md for the corporate-inbox trade-off.
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

/** True when OTP code entry is offered alongside the magic link. Requires the
 *  Supabase email template to include {{ .Token }} — see docs/auth.md. */
export const OTP_CODE_ENABLED = import.meta.env.VITE_AUTH_OTP_ENABLED === 'true';
