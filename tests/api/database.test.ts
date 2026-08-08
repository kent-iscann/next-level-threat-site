import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ENTITLING_STATUSES,
  STRIPE_STATUSES,
  MAX_TIER,
  MIN_CONTENT_TIER,
  NO_TIER,
  CONTENT_KINDS,
  effectiveTier,
  canAccess,
  isEntitlingStatus,
  toPublicContentItem,
  type ProContentRow,
} from '../../api/_lib/database.ts';

const migrationsDir = fileURLToPath(new URL('../../supabase/migrations', import.meta.url));
const migrationSql = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => readFileSync(join(migrationsDir, f), 'utf8'))
  .join('\n');

/** Pulls the quoted values out of a `... in ('a', 'b')` list. */
function quotedValues(fragment: string): string[] {
  return [...fragment.matchAll(/'([^']+)'/g)].map((m) => m[1]!);
}

describe('SQL ↔ TypeScript agreement', () => {
  it('current_tier() grants exactly the statuses ENTITLING_STATUSES lists', () => {
    // Drift here silently grants or revokes access for real subscribers, and
    // neither side would fail on its own.
    const match = migrationSql.match(/and\s+s\.status\s+in\s*\(([^)]*)\)/i);
    expect(match, 'could not find the status filter in current_tier()').toBeTruthy();

    expect(quotedValues(match![1]!).sort()).toEqual([...ENTITLING_STATUSES].sort());
  });

  it('the status CHECK constraint matches STRIPE_STATUSES', () => {
    const match = migrationSql.match(
      /constraint\s+subscriptions_status_valid\s+check\s*\(\s*status\s+in\s*\(([\s\S]*?)\)/i
    );
    expect(match, 'could not find subscriptions_status_valid').toBeTruthy();

    expect(quotedValues(match![1]!).sort()).toEqual([...STRIPE_STATUSES].sort());
  });

  it('the kind CHECK constraint matches CONTENT_KINDS', () => {
    const match = migrationSql.match(
      /constraint\s+pro_content_kind_valid\s+check\s*\(\s*kind\s+in\s*\(([^)]*)\)/i
    );
    expect(match, 'could not find pro_content_kind_valid').toBeTruthy();

    expect(quotedValues(match![1]!).sort()).toEqual([...CONTENT_KINDS].sort());
  });

  it('the tier ranges match the constants', () => {
    expect(migrationSql).toMatch(
      new RegExp(`tier_level between ${NO_TIER} and ${MAX_TIER}`, 'i')
    );
    expect(migrationSql).toMatch(
      new RegExp(`min_tier between ${MIN_CONTENT_TIER} and ${MAX_TIER}`, 'i')
    );
  });
});

describe('migration safety properties', () => {
  it('enables RLS on every table it creates', () => {
    const created = [...migrationSql.matchAll(/create table public\.(\w+)/g)].map((m) => m[1]!);
    expect(created.length).toBeGreaterThan(0);
    for (const table of created) {
      expect(
        migrationSql,
        `${table} is missing ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
      ).toMatch(new RegExp(`alter table public\\.${table}\\s+enable row level security`, 'i'));
    }
  });

  it('grants no client-role access to the server-only tables', () => {
    for (const table of ['pro_content', 'stripe_events']) {
      expect(migrationSql).toMatch(
        new RegExp(`revoke all on public\\.${table}\\s+from anon, authenticated`, 'i')
      );
      expect(
        migrationSql.match(
          new RegExp(`grant[^;]*on public\\.${table}\\s+to[^;]*(anon|authenticated)`, 'is')
        ),
        `${table} must not be granted to anon or authenticated`
      ).toBeNull();
    }
  });

  it('grants service_role explicit access to every table it creates', () => {
    // Supabase's ALTER DEFAULT PRIVILEGES did not cover tables created by
    // `db push`: they arrived with no service_role privileges, so every /api
    // request failed with 42501 "permission denied". Relying on implicit
    // defaults makes access depend on which role ran the migration.
    const created = [...migrationSql.matchAll(/create table public\.(\w+)/g)].map((m) => m[1]!);
    expect(created.length).toBeGreaterThan(0);

    for (const table of created) {
      expect(
        migrationSql,
        `${table} has no explicit service_role grant — /api would get 42501`
      ).toMatch(new RegExp(`grant[^;]*on public\\.${table}\\s+to[^;]*service_role`, 'is'));
    }
  });

  it('gives subscriptions a select-only policy and no write policies', () => {
    expect(migrationSql).toMatch(/create policy subscriptions_select_own[\s\S]*?for select/i);
    expect(migrationSql).not.toMatch(/on public\.subscriptions\s+for (insert|update|delete)/i);
  });

  it('pins search_path on every function, blocking search_path hijacking', () => {
    const functions = [...migrationSql.matchAll(/create or replace function public\.(\w+)/g)];
    expect(functions.length).toBeGreaterThan(0);
    for (const [, name] of functions) {
      const body = migrationSql.slice(
        migrationSql.indexOf(`create or replace function public.${name}`)
      );
      expect(body.slice(0, 600), `${name} must set search_path`).toMatch(/set search_path = ''/);
    }
  });
});

describe('effectiveTier', () => {
  it.each(ENTITLING_STATUSES)('grants the stored tier while %s', (status) => {
    expect(effectiveTier({ status, tier_level: 3 })).toBe(3);
  });

  it.each(STRIPE_STATUSES.filter((s) => !isEntitlingStatus(s)))(
    'grants nothing while %s',
    (status) => {
      expect(effectiveTier({ status, tier_level: 3 })).toBe(NO_TIER);
    }
  );

  it('returns 0 for a missing subscription', () => {
    expect(effectiveTier(null)).toBe(NO_TIER);
    expect(effectiveTier(undefined)).toBe(NO_TIER);
  });

  it('clamps a tier above the ladder', () => {
    expect(effectiveTier({ status: 'active', tier_level: 99 })).toBe(MAX_TIER);
  });

  it('treats a negative or non-integer tier as no access', () => {
    expect(effectiveTier({ status: 'active', tier_level: -1 })).toBe(NO_TIER);
    expect(effectiveTier({ status: 'active', tier_level: 1.5 })).toBe(NO_TIER);
  });
});

describe('canAccess', () => {
  it('is a linear ladder', () => {
    expect(canAccess(3, 1)).toBe(true);
    expect(canAccess(3, 3)).toBe(true);
    expect(canAccess(3, 4)).toBe(false);
  });

  it('never lets tier 0 through, even for the lowest content tier', () => {
    expect(canAccess(NO_TIER, MIN_CONTENT_TIER)).toBe(false);
  });
});

describe('toPublicContentItem', () => {
  const row: ProContentRow = {
    id: 1,
    slug: 'taiwan-strait-q3',
    title: 'Taiwan Strait — Q3 Assessment',
    description: 'Scenario planning.',
    kind: 'pdf',
    storage_path: 'briefings/2026-08/taiwan.pdf',
    min_tier: 2,
    published_at: '2026-08-01T00:00:00Z',
    bytes: 1024,
    duration_seconds: null,
    metadata: { region: 'apac' },
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  };

  it('never exposes storage_path', () => {
    const unlocked = toPublicContentItem(row, 3);
    expect(unlocked).not.toHaveProperty('storage_path');
    expect(JSON.stringify(unlocked)).not.toContain('briefings/');
  });

  it('withholds storage_path from locked items too', () => {
    const locked = toPublicContentItem(row, 1);
    expect(locked.locked).toBe(true);
    expect(JSON.stringify(locked)).not.toContain('briefings/');
  });

  it('keeps metadata on locked items so the UI can upsell', () => {
    const locked = toPublicContentItem(row, 1);
    expect(locked.title).toBe(row.title);
    expect(locked.metadata).toEqual({ region: 'apac' });
  });

  it('marks items at or below the caller tier as unlocked', () => {
    expect(toPublicContentItem(row, 2).locked).toBe(false);
    expect(toPublicContentItem(row, 4).locked).toBe(false);
  });

  it('locks everything for a non-subscriber', () => {
    expect(toPublicContentItem(row, NO_TIER).locked).toBe(true);
  });
});
