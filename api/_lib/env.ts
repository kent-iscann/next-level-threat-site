/**
 * Typed environment access for server-side code.
 *
 * Nothing in here may ever be read from a `VITE_`-prefixed variable: Vite inlines
 * those into the client bundle at build time. Server secrets are unprefixed and
 * are read from process.env at request time.
 *
 * RUNTIME CONSTRAINT: Vercel compiles api/*.ts to api/*.js but does not rewrite
 * import specifiers, so every relative import here must be written with a `.js`
 * extension. See tests/api/import-specifiers.test.ts.
 */

export class MissingEnvError extends Error {
  // Not `name`: Error already owns that, and it holds the error class name.
  readonly varName: string;

  constructor(varName: string) {
    super(`Missing required environment variable: ${varName}`);
    this.name = 'MissingEnvError';
    this.varName = varName;
  }
}

export function requireEnv(name: string, env: NodeJS.ProcessEnv = process.env): string {
  const value = env[name];
  if (value === undefined || value.trim() === '') throw new MissingEnvError(name);
  return value;
}

export function optionalEnv(
  name: string,
  fallback: string,
  env: NodeJS.ProcessEnv = process.env
): string {
  const value = env[name];
  return value === undefined || value.trim() === '' ? fallback : value;
}

export function requireIntEnv(name: string, env: NodeJS.ProcessEnv = process.env): number {
  const raw = requireEnv(name, env);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed)) {
    throw new MissingEnvError(`${name} (expected an integer, got "${raw}")`);
  }
  return parsed;
}
