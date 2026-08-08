/**
 * Client-side content configuration.
 *
 * Free Watch Report content lives in a public bucket. Every reference to it goes
 * through here so the R2 → Supabase Storage cutover is a single env var change
 * rather than a hunt through components.
 *
 * PRO content is deliberately absent: it is private, and its URLs are minted
 * server-side per request after an entitlement check (Phase 4).
 *
 * VITE_CONTENT_BASE_URL must NOT include the bucket name. Paths passed to
 * contentUrl() already start with it, mirroring the original R2 layout:
 *
 *   ✅ https://<ref>.supabase.co/storage/v1/object/public
 *   ❌ https://<ref>.supabase.co/storage/v1/object/public/watch-reports
 *      └─ yields .../public/watch-reports/watch-reports/manifest.json
 */

const R2_PUBLIC_BASE = 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev';

/** First path segment of every free-content path; also the Supabase bucket id. */
export const WATCH_REPORTS_PREFIX = 'watch-reports';

export const CONTENT_BASE_URL: string = (
  import.meta.env.VITE_CONTENT_BASE_URL || R2_PUBLIC_BASE
).replace(/\/+$/, '');

// Catch the duplicated-bucket mistake at boot rather than via a 400 from storage.
if (import.meta.env.DEV && CONTENT_BASE_URL.endsWith(`/${WATCH_REPORTS_PREFIX}`)) {
  console.warn(
    `[config] VITE_CONTENT_BASE_URL ends with "/${WATCH_REPORTS_PREFIX}". It must be the ` +
      `storage root without the bucket — content paths already include it, so URLs will ` +
      `come out as .../${WATCH_REPORTS_PREFIX}/${WATCH_REPORTS_PREFIX}/...`
  );
}

/** Builds an absolute URL for a public content path (bucket included in `path`). */
export function contentUrl(path: string): string {
  return `${CONTENT_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

export const WATCH_REPORTS_MANIFEST_URL = contentUrl(`${WATCH_REPORTS_PREFIX}/manifest.json`);

/** Server-side proxy used when the direct bucket fetch fails (CORS, outage). */
export const MANIFEST_FALLBACK_URL = '/api/manifest';

// ── Auth ────────────────────────────────────────────────────────────────────

/** Supabase permits 6–10; hosted projects default to 8. Must match
 *  Authentication → Email settings, or codes get truncated on entry. */
const DEFAULT_CODE_LENGTH = 8;
const MIN_CODE_LENGTH = 6;
const MAX_CODE_LENGTH = 10;

function parseCodeLength(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isInteger(parsed)) return DEFAULT_CODE_LENGTH;
  return Math.min(MAX_CODE_LENGTH, Math.max(MIN_CODE_LENGTH, parsed));
}

export const AUTH_CODE_LENGTH: number = parseCodeLength(
  import.meta.env.VITE_AUTH_CODE_LENGTH
);

/** Supabase rate-limits OTP requests to one per 60s per address. Overridable
 *  only so tests can shorten it; there is no reason to change it in production. */
export const RESEND_COOLDOWN_SECONDS: number = (() => {
  const parsed = Number.parseInt(import.meta.env.VITE_AUTH_RESEND_COOLDOWN ?? '', 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 60;
})();
