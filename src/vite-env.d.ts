/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public bucket base URL for free Watch Report content. Falls back to R2. */
  readonly VITE_CONTENT_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** "true" offers 6-digit code entry beside the magic link. Requires the
   *  Supabase email template to include {{ .Token }} — see docs/auth.md. */
  readonly VITE_AUTH_OTP_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
