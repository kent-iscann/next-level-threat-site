/**
 * Guards against TypeScript that type-checks but cannot RUN on Vercel.
 *
 * Vercel executes /api files with Node's strip-only type removal: types are
 * erased, no code is generated. Constructs needing transformation — parameter
 * properties, enums, decorators, namespaces, `import x = require()` — pass tsc
 * and then fail at module load with FUNCTION_INVOCATION_FAILED.
 *
 * Vitest cannot catch this in-process: it imports through Vite, which fully
 * transpiles TS and happily accepts all of the above. So each module is loaded
 * in a real `node` subprocess, exactly as the deployment does.
 *
 * This suite exists because a parameter property in _lib/env.ts took down both
 * production functions while all 72 unit tests stayed green.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const apiDir = fileURLToPath(new URL('../../api', import.meta.url));

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectTsFiles(full);
    return entry.endsWith('.ts') ? [full] : [];
  });
}

const modules = collectTsFiles(apiDir);

describe('api modules load under Node type stripping', () => {
  it('finds modules to check', () => {
    expect(modules.length).toBeGreaterThan(0);
  });

  it.each(modules.map((m) => [relative(apiDir, m).replace(/\\/g, '/'), m]))(
    'api/%s loads',
    (_name, file) => {
      const url = pathToFileURL(file).href;
      try {
        execFileSync(
          process.execPath,
          ['--input-type=module', '-e', `await import(${JSON.stringify(url)})`],
          { stdio: 'pipe', timeout: 30_000 }
        );
      } catch (err) {
        const stderr = (err as { stderr?: Buffer }).stderr?.toString() ?? String(err);
        throw new Error(`Module fails to load in Node:\n${stderr.split('\n').slice(0, 6).join('\n')}`);
      }
    }
  );
});
