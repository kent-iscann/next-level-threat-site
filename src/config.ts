/**
 * Client-side content configuration.
 *
 * Free Watch Report content lives in a public bucket. Every reference to it goes
 * through here so the R2 → Supabase Storage cutover is a single env var change
 * rather than a hunt through components.
 *
 * PRO content is deliberately absent: it is private, and its URLs are minted
 * server-side per request after an entitlement check (Phase 4).
 */

const R2_PUBLIC_BASE = 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev';

/** Override with VITE_CONTENT_BASE_URL, e.g.
 *  https://<project>.supabase.co/storage/v1/object/public/watch-reports */
export const CONTENT_BASE_URL: string = (
  import.meta.env.VITE_CONTENT_BASE_URL || R2_PUBLIC_BASE
).replace(/\/+$/, '');

/** Builds an absolute URL for a public content path. */
export function contentUrl(path: string): string {
  return `${CONTENT_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

export const WATCH_REPORTS_MANIFEST_URL = contentUrl('watch-reports/manifest.json');

/** Server-side proxy used when the direct bucket fetch fails (CORS, outage). */
export const MANIFEST_FALLBACK_URL = '/api/manifest';
