/**
 * Types and entitlement rules mirroring supabase/migrations.
 *
 * The status list below duplicates public.current_tier() in SQL. That
 * duplication is intentional — the webhook and API need the rule in TypeScript,
 * and RLS/SQL needs it in Postgres — but drift between the two would silently
 * grant or deny access. tests/api/database.test.ts parses the migration and
 * fails if they disagree.
 */

/** Verbatim Stripe subscription statuses; matches the CHECK constraint. */
export const STRIPE_STATUSES = [
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused',
] as const;
export type StripeStatus = (typeof STRIPE_STATUSES)[number];

/**
 * Statuses that grant access.
 *
 * past_due is included deliberately: Stripe's dunning runs ~3 weeks before
 * giving up, and cutting off a paying subscriber over a temporarily declined
 * card is worse than three weeks of grace. Access ends at `canceled`.
 */
export const ENTITLING_STATUSES = ['active', 'trialing', 'past_due'] as const;
export type EntitlingStatus = (typeof ENTITLING_STATUSES)[number];

/** 0 means no access; content tiers start at 1. */
export const NO_TIER = 0;
export const MIN_CONTENT_TIER = 1;
export const MAX_TIER = 4;

export const CONTENT_KINDS = ['pdf', 'audio', 'video'] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: StripeStatus;
  tier_level: number;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type ProContentRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  kind: ContentKind;
  /** Key inside the private pro-content bucket. MUST NOT reach a client. */
  storage_path: string;
  min_tier: number;
  published_at: string | null;
  bytes: number | null;
  duration_seconds: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type StripeEventRow = {
  id: string;
  type: string;
  processed_at: string;
};

export function isEntitlingStatus(status: string): status is EntitlingStatus {
  return (ENTITLING_STATUSES as readonly string[]).includes(status);
}

/** Effective tier for a subscription row. Mirrors public.current_tier(). */
export function effectiveTier(
  subscription: Pick<SubscriptionRow, 'status' | 'tier_level'> | null | undefined
): number {
  if (!subscription) return NO_TIER;
  if (!isEntitlingStatus(subscription.status)) return NO_TIER;
  const tier = subscription.tier_level;
  if (!Number.isInteger(tier) || tier < NO_TIER) return NO_TIER;
  return Math.min(tier, MAX_TIER);
}

/** The whole access rule: a linear ladder, nothing more. */
export function canAccess(userTier: number, minTier: number): boolean {
  return userTier >= minTier && userTier >= MIN_CONTENT_TIER;
}

/**
 * Strips fields that must never reach a browser, and marks whether the caller
 * can open the item. Locked rows keep their metadata so the UI can upsell.
 */
export type PublicContentItem = Omit<ProContentRow, 'storage_path' | 'created_at' | 'updated_at'> & {
  locked: boolean;
};

export function toPublicContentItem(row: ProContentRow, userTier: number): PublicContentItem {
  const { storage_path: _storagePath, created_at: _created, updated_at: _updated, ...rest } = row;
  return { ...rest, locked: !canAccess(userTier, row.min_tier) };
}
