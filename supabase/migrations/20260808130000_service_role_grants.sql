-- Grant the API role access to the Phase 2 tables.
--
-- 20260808120000 assumed Supabase's default privileges would grant service_role
-- access to new tables in public. They did not — tables created by `db push`
-- arrived with no service_role privileges at all, so every request from /api
-- failed with:
--
--   42501  permission denied for table pro_content
--
-- Granting explicitly is better regardless: relying on ALTER DEFAULT PRIVILEGES
-- makes access depend on which role happened to run the migration.
--
-- This does NOT weaken the model. service_role is server-only, never sent to a
-- browser, and bypasses RLS by design — it is the role /api authenticates as
-- when it mediates access. anon and authenticated remain revoked.

grant select, insert, update, delete on public.subscriptions to service_role;
grant select, insert, update, delete on public.stripe_events to service_role;
grant select, insert, update, delete on public.pro_content   to service_role;

-- Reassert the client-role posture so this file is a complete statement of
-- intent, and so re-running it cannot leave a permissive gap.
revoke all on public.stripe_events from anon, authenticated;
revoke all on public.pro_content   from anon, authenticated;

revoke all on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;
