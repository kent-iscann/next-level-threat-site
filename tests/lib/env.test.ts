import { describe, it, expect } from 'vitest';
import {
  requireEnv,
  optionalEnv,
  requireIntEnv,
  MissingEnvError,
} from '../../api/_lib/env.ts';

describe('requireEnv', () => {
  it('returns the value when set', () => {
    expect(requireEnv('KEY', { KEY: 'value' })).toBe('value');
  });

  it('throws MissingEnvError when absent', () => {
    expect(() => requireEnv('KEY', {})).toThrow(MissingEnvError);
  });

  it('treats an empty or whitespace value as missing', () => {
    expect(() => requireEnv('KEY', { KEY: '' })).toThrow(MissingEnvError);
    expect(() => requireEnv('KEY', { KEY: '   ' })).toThrow(MissingEnvError);
  });

  it('names the missing variable in the error', () => {
    expect(() => requireEnv('BREVO_API_KEY', {})).toThrow(/BREVO_API_KEY/);
  });
});

describe('optionalEnv', () => {
  it('returns the value when set', () => {
    expect(optionalEnv('KEY', 'fallback', { KEY: 'value' })).toBe('value');
  });

  it('falls back when absent or blank', () => {
    expect(optionalEnv('KEY', 'fallback', {})).toBe('fallback');
    expect(optionalEnv('KEY', 'fallback', { KEY: '  ' })).toBe('fallback');
  });
});

describe('requireIntEnv', () => {
  it('parses an integer', () => {
    expect(requireIntEnv('LIST_ID', { LIST_ID: '7' })).toBe(7);
  });

  it('throws on a non-numeric value', () => {
    expect(() => requireIntEnv('LIST_ID', { LIST_ID: 'abc' })).toThrow(MissingEnvError);
  });

  it('throws when absent', () => {
    expect(() => requireIntEnv('LIST_ID', {})).toThrow(MissingEnvError);
  });
});
