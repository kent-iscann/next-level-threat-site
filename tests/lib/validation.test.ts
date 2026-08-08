import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  normalizeEmail,
  readJson,
  MAX_EMAIL_LENGTH,
} from '../../api/_lib/validation.ts';

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Kent@Example.COM  ')).toBe('kent@example.com');
  });
});

describe('isValidEmail', () => {
  it.each([
    'a@b.co',
    'kent@example.com',
    'first.last+tag@sub.domain.co.uk',
    '  Kent@Example.com  ',
  ])('accepts %j', (input) => {
    expect(isValidEmail(input)).toBe(true);
  });

  it.each([
    ['empty string', ''],
    ['whitespace only', '   '],
    ['no @', 'not-an-email'],
    ['no domain dot', 'kent@localhost'],
    ['no local part', '@example.com'],
    ['no TLD', 'kent@example.'],
    ['internal space', 'kent smith@example.com'],
    ['double @', 'kent@@example.com'],
  ])('rejects %s', (_label, input) => {
    expect(isValidEmail(input)).toBe(false);
  });

  it.each([
    ['number', 42],
    ['null', null],
    ['undefined', undefined],
    ['object', { email: 'kent@example.com' }],
    ['array', ['kent@example.com']],
  ])('rejects non-string %s', (_label, input) => {
    expect(isValidEmail(input)).toBe(false);
  });

  it(`rejects emails longer than ${MAX_EMAIL_LENGTH} chars`, () => {
    const local = 'a'.repeat(MAX_EMAIL_LENGTH);
    expect(isValidEmail(`${local}@example.com`)).toBe(false);
  });
});

describe('readJson', () => {
  const post = (body: string) =>
    new Request('https://example.com/api/subscribe', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });

  it('parses a JSON object', async () => {
    expect(await readJson(post('{"email":"kent@example.com"}'))).toEqual({
      email: 'kent@example.com',
    });
  });

  it('returns null for malformed JSON rather than throwing', async () => {
    expect(await readJson(post('{not json'))).toBeNull();
  });

  it('returns null for a JSON array', async () => {
    expect(await readJson(post('[1,2,3]'))).toBeNull();
  });

  it('returns null for a bare JSON literal', async () => {
    expect(await readJson(post('null'))).toBeNull();
    expect(await readJson(post('"a string"'))).toBeNull();
  });
});
