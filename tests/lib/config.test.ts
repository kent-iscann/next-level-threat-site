import { describe, it, expect } from 'vitest';
import {
  contentUrl,
  CONTENT_BASE_URL,
  WATCH_REPORTS_MANIFEST_URL,
  MANIFEST_FALLBACK_URL,
} from '../../src/config.ts';

describe('contentUrl', () => {
  it('joins a plain path to the base', () => {
    expect(contentUrl('watch-reports/manifest.json')).toBe(
      `${CONTENT_BASE_URL}/watch-reports/manifest.json`
    );
  });

  it('does not double up slashes when the path is absolute', () => {
    expect(contentUrl('/watch-reports/a.pdf')).toBe(`${CONTENT_BASE_URL}/watch-reports/a.pdf`);
    expect(contentUrl('/watch-reports/a.pdf')).not.toContain('//watch-reports');
  });

  it('produces a URL that parses', () => {
    expect(() => new URL(contentUrl('watch-reports/a.pdf'))).not.toThrow();
  });
});

describe('base URL', () => {
  it('carries no trailing slash', () => {
    expect(CONTENT_BASE_URL.endsWith('/')).toBe(false);
  });

  it('defaults to the R2 bucket until VITE_CONTENT_BASE_URL is set', () => {
    // Guards the cutover: once Supabase is populated this expectation flips,
    // which is the reminder to also repoint WATCH_REPORTS_MANIFEST_URL on the server.
    expect(CONTENT_BASE_URL).toBe(
      import.meta.env.VITE_CONTENT_BASE_URL || 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev'
    );
  });
});

describe('manifest URLs', () => {
  it('points at watch-reports/manifest.json', () => {
    expect(WATCH_REPORTS_MANIFEST_URL).toBe(`${CONTENT_BASE_URL}/watch-reports/manifest.json`);
  });

  it('uses a same-origin relative path for the fallback', () => {
    expect(MANIFEST_FALLBACK_URL).toBe('/api/manifest');
  });
});
