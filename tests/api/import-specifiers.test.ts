/**
 * Every relative import under api/ must end in `.js`.
 *
 * Vercel compiles api/*.ts to api/*.js but does NOT rewrite import specifiers.
 * A source import of './_lib/http.ts' therefore becomes a runtime lookup for a
 * file that does not exist in the deployed bundle:
 *
 *   Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/_lib/http.ts'
 *   imported from /var/task/api/me.js
 *
 * Writing `.js` in the TypeScript source is the standard ESM+TS convention:
 * tsc resolves it to the .ts file at compile time, and the emitted JS points at
 * the real .js file at runtime. Extensionless is also wrong here — Node's ESM
 * resolver requires explicit extensions.
 *
 * This check is static and instant. tests/api/build-output.test.ts proves the
 * same thing against a real build, but costs a full `vercel build`.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = fileURLToPath(new URL('../../api', import.meta.url));

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectTsFiles(full);
    return entry.endsWith('.ts') ? [full] : [];
  });
}

const files = collectTsFiles(apiDir);

/** Matches the specifier in `import ... from '<spec>'` and `export ... from '<spec>'`. */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+['"]([^'"]+)['"]/g;

function relativeSpecifiers(source: string): string[] {
  return [...source.matchAll(IMPORT_RE)]
    .map((m) => m[1]!)
    .filter((spec) => spec.startsWith('.'));
}

describe('api import specifiers', () => {
  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [relative(apiDir, f).replace(/\\/g, '/'), f]))(
    'api/%s uses .js specifiers for relative imports',
    (_name, file) => {
      const specs = relativeSpecifiers(readFileSync(file, 'utf8'));
      const bad = specs.filter((s) => !s.endsWith('.js'));
      expect(
        bad,
        `these relative imports must end in .js so the compiled output resolves: ${bad.join(', ')}`
      ).toEqual([]);
    }
  );

  it('rejects a .ts specifier', () => {
    expect(relativeSpecifiers(`import { a } from './_lib/http.ts';`)).toEqual(['./_lib/http.ts']);
  });

  it('rejects an extensionless specifier', () => {
    const specs = relativeSpecifiers(`import { a } from './_lib/http';`);
    expect(specs.filter((s) => !s.endsWith('.js'))).toEqual(['./_lib/http']);
  });

  it('ignores bare package imports', () => {
    expect(relativeSpecifiers(`import { jwtVerify } from 'jose';`)).toEqual([]);
  });
});
