/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public bucket base URL for free Watch Report content. Falls back to R2. */
  readonly VITE_CONTENT_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
