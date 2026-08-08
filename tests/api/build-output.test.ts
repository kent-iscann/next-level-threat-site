/**
 * Loads the functions Vercel actually deploys.
 *
 * The earlier version of this file imported the TypeScript sources through a
 * plain `node` subprocess, on the assumption that Vercel used Node's strip-only
 * type removal. It does not — it runs a real TypeScript compile. That test
 * therefore modelled the wrong runtime: it rejected valid code (parameter
 * properties compile fine on Vercel) and missed the real defect (`.ts` import
 * specifiers, which plain Node resolves happily but the compiled bundle cannot).
 *
 * Loading .vercel/output is the only check with the right fidelity. It is
 * skipped unless a build exists, so the fast suite stays fast:
 *
 *   npx vercel build && npm test        # full fidelity
 *   npm test                            # skips this file
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const outputDir = fileURLToPath(new URL('../../.vercel/output/functions/api', import.meta.url));
const built = existsSync(outputDir);

function handlerEntries(): { name: string; entry: string }[] {
  return readdirSync(outputDir)
    .filter((d) => d.endsWith('.func'))
    .map((d) => ({
      name: d.replace(/\.func$/, ''),
      entry: join(outputDir, d, 'api', `${d.replace(/\.func$/, '')}.js`),
    }))
    .filter((f) => existsSync(f.entry));
}

describe.skipIf(!built)('compiled Vercel functions load', () => {
  const entries = built ? handlerEntries() : [];

  it('found compiled functions', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries.map((e) => [e.name, e.entry]))('api/%s loads', (_name, entry) => {
    const url = pathToFileURL(entry).href;
    try {
      execFileSync(
        process.execPath,
        ['--input-type=module', '-e', `await import(${JSON.stringify(url)})`],
        { stdio: 'pipe', timeout: 30_000 }
      );
    } catch (err) {
      const stderr = (err as { stderr?: Buffer }).stderr?.toString() ?? String(err);
      throw new Error(
        `Compiled function fails to load — this is what production would do:\n${stderr
          .split('\n')
          .slice(0, 8)
          .join('\n')}`
      );
    }
  });

  it.each(entries.map((e) => [e.name, e.entry]))(
    'api/%s exports at least one HTTP method handler',
    async (_name, entry) => {
      const mod = await import(pathToFileURL(entry).href);
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'default'];
      expect(methods.some((m) => typeof mod[m] === 'function' || typeof mod[m] === 'object')).toBe(
        true
      );
    }
  );
});

describe.skipIf(built)('compiled Vercel functions', () => {
  it('skipped — run `npx vercel build` first for full-fidelity checks', () => {
    expect(built).toBe(false);
  });
});
