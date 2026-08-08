/**
 * Typed environment access for server-side code.
 *
 * Nothing in here may ever be read from a `VITE_`-prefixed variable: Vite inlines
 * those into the client bundle at build time. Server secrets are unprefixed and
 * are read from process.env at request time.
 */

export class MissingEnvError extends Error {
  constructor(public readonly name: string) {
    super(`Missing required environment variable: ${name}`);
    this.name = 'MissingEnvError';
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
