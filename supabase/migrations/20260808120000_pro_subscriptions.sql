-- Phase 2 — subscription state, webhook idempotency, and the PRO content catalog.
--
-- Design notes:
--   * Stripe is the source of truth for BILLING. This schema is a mirror kept
--     current by the webhook, so request-time entitlement checks never call
--     Stripe.
--   * Tiers are a linear ladder: access is `tier_level >= min_tier`. There is no
--     feature matrix and no join table, deliberately.
--   * subscriptions is readable by its owner. pro_content and stripe_events are
--     server-only: RLS is enabled with NO policies, which denies everything that
--     is not the service role.

-- ── helpers ─────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at is
  'Trigger helper: stamps updated_at on every UPDATE.';

-- ── subscriptions ───────────────────────────────────────────────────────────

create table public.subscriptions (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id     text not null unique,
  stripe_subscription_id text unique,
  status                 text not null,
  tier_level             smallint not null default 0,
  price_id               text,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint subscriptions_tier_level_range
    check (tier_level between 0 and 4),

  -- Mirrors Stripe's subscription.status enum. An unrecognised value means the
  -- webhook met something new and should fail loudly rather than guess.
  constraint subscriptions_status_valid check (
    status in (
      'incomplete', 'incomplete_expired', 'trialing', 'active',
      'past_due', 'canceled', 'unpaid', 'paused'
    )
  )
);

comment on table public.subscriptions is
  'Mirror of Stripe subscription state, one row per user. Written only by the Stripe webhook via the service role.';
comment on column public.subscriptions.tier_level is
  '0 = no access. 1..4 ascend; access is granted when tier_level >= pro_content.min_tier.';
comment on column public.subscriptions.status is
  'Verbatim Stripe status. See public.current_tier() for which values grant access.';

create index subscriptions_status_idx on public.subscriptions (status);
create index subscriptions_period_end_idx on public.subscriptions (current_period_end);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ── stripe_events (webhook idempotency) ─────────────────────────────────────

create table public.stripe_events (
  id           text primary key,
  type         text not null,
  processed_at timestamptz not null default now()
);

comment on table public.stripe_events is
  'Processed Stripe event ids. Stripe retries deliveries, and the Brevo sync is not naturally idempotent, so the webhook inserts here first and exits early on conflict.';

create index stripe_events_processed_at_idx on public.stripe_events (processed_at);

-- ── pro_content ─────────────────────────────────────────────────────────────

create table public.pro_content (
  id               bigint generated always as identity primary key,
  slug             text not null unique,
  title            text not null,
  description      text,
  kind             text not null,
  storage_path     text not null,
  min_tier         smallint not null,
  published_at     timestamptz,
  bytes            bigint,
  duration_seconds integer,
  -- Generic on purpose: the PRO interface is undesigned, and region tags or
  -- threat scores should not each require a migration.
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint pro_content_kind_valid check (kind in ('pdf', 'audio', 'video')),
  constraint pro_content_min_tier_range check (min_tier between 1 and 4),
  constraint pro_content_storage_path_not_blank check (length(trim(storage_path)) > 0)
);

comment on table public.pro_content is
  'Catalog of gated PRO assets. storage_path is a key inside the private pro-content bucket and must never reach a client; the API returns locked items without it.';
comment on column public.pro_content.min_tier is
  'Lowest tier_level that unlocks this item.';

create index pro_content_browse_idx
  on public.pro_content (min_tier, published_at desc nulls last);
create index pro_content_published_idx
  on public.pro_content (published_at desc nulls last)
  where published_at is not null;

create trigger pro_content_set_updated_at
  before update on public.pro_content
  for each row execute function public.set_updated_at();

-- ── entitlement helper ──────────────────────────────────────────────────────

-- Single definition of "which Stripe statuses grant access", so the webhook,
-- the content listing and the media signer cannot drift apart.
--
-- past_due IS included: Stripe's dunning runs ~3 weeks before giving up, and
-- cutting a paying subscriber off over a temporarily declined card is worse
-- than three weeks of grace. Access ends when the status reaches canceled.
create or replace function public.current_tier(p_user_id uuid)
returns smallint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select s.tier_level
      from public.subscriptions s
      where s.user_id = p_user_id
        and s.status in ('active', 'trialing', 'past_due')
    ),
    0
  )::smallint;
$$;

comment on function public.current_tier is
  'Effective tier for a user: their tier_level when the subscription is active, trialing or past_due, else 0.';

-- ── row level security ──────────────────────────────────────────────────────

alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;
alter table public.pro_content   enable row level security;

-- Users may read their own subscription and nothing else. There are
-- deliberately no INSERT/UPDATE/DELETE policies: all writes come from the
-- Stripe webhook using the service role, which bypasses RLS.
create policy subscriptions_select_own
  on public.subscriptions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- pro_content and stripe_events have RLS enabled and NO policies at all, which
-- denies every non-service-role request. Content reaches the browser only
-- through /api, which filters by tier and strips storage_path.

-- ── grants (defence in depth behind RLS) ────────────────────────────────────

revoke all on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;

revoke all on public.stripe_events from anon, authenticated;
revoke all on public.pro_content   from anon, authenticated;

revoke execute on function public.current_tier(uuid) from anon, public;
grant execute on function public.current_tier(uuid) to authenticated, service_role;
