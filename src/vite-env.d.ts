/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public bucket base URL for free Watch Report content. Falls back to R2. */
  readonly VITE_CONTENT_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** Digits in the emailed sign-in code. Must match Supabase →
   *  Authentication → Email settings. 6–10, defaults to 8. */
  readonly VITE_AUTH_CODE_LENGTH?: string;
  /** Resend cooldown in seconds. Test-only override; defaults to 60. */
  readonly VITE_AUTH_RESEND_COOLDOWN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
