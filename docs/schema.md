# Database schema (Phase 2)

Three tables. Stripe is the source of truth for billing; this schema is a mirror
kept current by the webhook, so entitlement checks never call Stripe at request
time.

| Table | Written by | Readable by |
|---|---|---|
| `subscriptions` | Stripe webhook (service role) | its owner, via RLS |
| `stripe_events` | Stripe webhook (service role) | nobody |
| `pro_content` | you / the content pipeline | nobody directly — only `/api` |

## The access rule

```
access = subscriptions.tier_level >= pro_content.min_tier
         AND subscriptions.status IN ('active','trialing','past_due')
```

A linear ladder, nothing more. `tier_level` 0 means no access; content tiers run
1–4.

`past_due` grants access on purpose. Stripe's dunning runs about three weeks
before giving up, and cutting off a paying subscriber over a temporarily
declined card is worse than three weeks of grace. Access ends at `canceled`.

That rule exists twice — in `public.current_tier()` for SQL and in
`api/_lib/database.ts` for TypeScript. Drift between them would silently grant
or revoke access, so `tests/api/database.test.ts` parses the migration and fails
if the two disagree.

## Why pro_content has RLS enabled and no policies

RLS with zero policies denies everything that is not the service role. That is
the intent: content reaches the browser only through `/api`, which filters by
tier and strips `storage_path` before responding.

Serving it through the API rather than exposing the table also lets a locked
item keep its title, description and metadata so the UI can upsell — something a
row-level filter cannot express, because it can only hide the whole row.

Grants are revoked from `anon` and `authenticated` as well. RLS alone would be
sufficient, but if someone later adds a permissive policy by accident, the
missing grant still holds the line.

## Grant `service_role` explicitly

Tables created by `supabase db push` arrive with **no `service_role`
privileges** — Supabase's `ALTER DEFAULT PRIVILEGES` did not apply to them. The
first migration only revoked from `anon`/`authenticated` and assumed the API
role was covered by defaults. It wasn't, and every `/api` request failed with:

```
42501  permission denied for table pro_content
```

Every new table therefore needs an explicit grant:

```sql
grant select, insert, update, delete on public.<table> to service_role;
```

`tests/api/database.test.ts` enforces this for every `create table` in the
migrations, so the next table cannot repeat it.

This does not weaken the model: `service_role` is server-only, never sent to a
browser, and bypasses RLS by design — it is the role `/api` authenticates as
while mediating access.

## Applying migrations

The CLI is linked to `fogqlopcnrnalpxyxxke`:

```bash
npx supabase migration list      # local vs remote state
npx supabase db push --yes       # apply anything pending
```

Never edit an applied migration — `db push` tracks them by filename and will not
re-run one it has already seen. Add a new file instead, as
`20260808130000_service_role_grants.sql` does.

A Docker warning during push (`failed to cache migrations catalog`) is expected
and harmless: we deliberately skip the local Supabase stack, so there is no
Docker daemon to build the local catalog against. The migration still applies.

## Verifying afterwards

```bash
node --env-file=.env scripts/verify-schema.mjs
```

This talks to the live project with both the anon key and the secret key and
checks what static review cannot: that the tables exist, that anon is actually
denied on all three, that the CHECK constraints reject bad tiers/kinds/paths,
that the `updated_at` trigger fires, that duplicate slugs are rejected, and that
`current_tier()` returns 0 for an unknown user and is not executable by anon.
It cleans up the row it writes.

## Regenerating types

`api/_lib/database.ts` is hand-written. Once the CLI is linked it can be
regenerated from the live schema instead:

```bash
npx supabase gen types typescript --linked > api/_lib/database.generated.ts
```

Keep the hand-written entitlement helpers (`effectiveTier`, `canAccess`,
`toPublicContentItem`) either way — generated output contains row shapes only,
not rules.
