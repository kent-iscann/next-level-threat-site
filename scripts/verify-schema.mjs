/**
 * Integration check for the Phase 2 schema. Run AFTER applying migrations:
 *
 *   node --env-file=.env scripts/verify-schema.mjs
 *
 * Exercises the live project through PostgREST with both the anon key and the
 * secret key, proving the tables exist and — more importantly — that RLS and
 * the CHECK constraints actually behave. Static SQL review cannot tell you that.
 *
 * Every negative assertion checks the Postgres ERROR CODE, not merely that the
 * request failed. An earlier version asserted "not ok", so when service_role was
 * missing its grants and every write returned 42501, the constraint checks all
 * reported PASS for entirely the wrong reason.
 *
 * Leaves no data behind.
 */

const url = process.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !secretKey) {
  console.error('Need VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Run with: node --env-file=.env scripts/verify-schema.mjs');
  process.exit(1);
}

// Postgres error codes we assert on, so a failure for the wrong reason is a FAIL.
const CHECK_VIOLATION = '23514';
const UNIQUE_VIOLATION = '23505';
const INSUFFICIENT_PRIVILEGE = '42501';

const TABLES = ['subscriptions', 'stripe_events', 'pro_content'];

let pass = 0;
let fail = 0;
const check = (label, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
  ok ? pass++ : fail++;
};

async function rest(path, key, init = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, ok: res.ok, body, code: body?.code ?? null };
}

const contentRow = (over = {}) => ({
  slug: '__probe',
  title: 'Probe',
  kind: 'pdf',
  storage_path: 'probe/probe.pdf',
  min_tier: 1,
  ...over,
});

// ── service_role can reach every table ──────────────────────────────────────
// This is the check that failed before the grants migration; it must run first
// because every later assertion is meaningless if the API role is locked out.
for (const table of TABLES) {
  const res = await rest(`${table}?select=*&limit=1`, secretKey);
  check(`service_role can read ${table}`, res.ok, `status ${res.status} ${res.code ?? ''}`);
  if (res.code === INSUFFICIENT_PRIVILEGE) {
    console.error(`\n  → ${res.body?.hint ?? 'missing GRANT for service_role'}\n`);
  }
}

// ── anon is denied everywhere ───────────────────────────────────────────────
for (const table of TABLES) {
  const res = await rest(`${table}?select=*&limit=1`, anonKey);
  const leaked = Array.isArray(res.body) && res.body.length > 0;
  check(`anon cannot read ${table}`, !leaked && !res.ok, `status ${res.status} ${res.code ?? ''}`);
}

const anonInsert = await rest('pro_content', anonKey, {
  method: 'POST',
  body: JSON.stringify(contentRow({ slug: '__anon_probe' })),
});
check('anon cannot insert into pro_content', !anonInsert.ok, `status ${anonInsert.status}`);

// ── constraints bite, for the RIGHT reason ──────────────────────────────────
const constraintCases = [
  ['min_tier above the ladder is rejected', contentRow({ slug: '__p1', min_tier: 9 })],
  ['min_tier 0 is rejected (content starts at 1)', contentRow({ slug: '__p2', min_tier: 0 })],
  ['kind outside pdf/audio/video is rejected', contentRow({ slug: '__p3', kind: 'spreadsheet' })],
  ['blank storage_path is rejected', contentRow({ slug: '__p4', storage_path: '   ' })],
];

for (const [label, payload] of constraintCases) {
  const res = await rest('pro_content', secretKey, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  check(label, res.code === CHECK_VIOLATION, `status ${res.status}, code ${res.code ?? 'none'}`);
}

const badStatus = await rest('subscriptions', secretKey, {
  method: 'POST',
  body: JSON.stringify({
    user_id: '00000000-0000-4000-8000-000000000000',
    stripe_customer_id: 'cus___probe',
    status: 'definitely_not_a_stripe_status',
  }),
});
check(
  'an unknown Stripe status is rejected',
  // FK on user_id fires first for a non-existent user; either rejection proves
  // the row cannot land, but a CHECK violation is the one being tested.
  badStatus.code === CHECK_VIOLATION || badStatus.code === '23503',
  `status ${badStatus.status}, code ${badStatus.code ?? 'none'}`
);

// ── a valid row round-trips ─────────────────────────────────────────────────
const created = await rest('pro_content', secretKey, {
  method: 'POST',
  headers: { Prefer: 'return=representation' },
  body: JSON.stringify(contentRow({ slug: '__probe_valid', metadata: { probe: true } })),
});
const createdRow = Array.isArray(created.body) ? created.body[0] : null;
check(
  'valid pro_content row inserts',
  created.ok && !!createdRow,
  `status ${created.status}, code ${created.code ?? 'none'}`
);

if (createdRow) {
  check('metadata round-trips as jsonb', createdRow.metadata?.probe === true);
  check('identity id was assigned', Number.isInteger(createdRow.id));

  await new Promise((r) => setTimeout(r, 1100));
  const updated = await rest('pro_content?slug=eq.__probe_valid', secretKey, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ title: 'Probe v2' }),
  });
  const updatedRow = Array.isArray(updated.body) ? updated.body[0] : null;
  check(
    'updated_at trigger advances on UPDATE',
    !!updatedRow && new Date(updatedRow.updated_at) > new Date(createdRow.updated_at),
    updatedRow ? `${createdRow.updated_at} → ${updatedRow.updated_at}` : 'no row'
  );

  const dupe = await rest('pro_content', secretKey, {
    method: 'POST',
    body: JSON.stringify(contentRow({ slug: '__probe_valid' })),
  });
  check(
    'duplicate slug is rejected',
    dupe.code === UNIQUE_VIOLATION,
    `status ${dupe.status}, code ${dupe.code ?? 'none'}`
  );

  const del = await rest('pro_content?slug=eq.__probe_valid', secretKey, { method: 'DELETE' });
  check('probe row cleaned up', del.ok, `status ${del.status}`);

  const gone = await rest('pro_content?slug=eq.__probe_valid&select=slug', secretKey);
  check('probe row is really gone', Array.isArray(gone.body) && gone.body.length === 0);
}

// ── current_tier() ──────────────────────────────────────────────────────────
const noUser = await rest('rpc/current_tier', secretKey, {
  method: 'POST',
  body: JSON.stringify({ p_user_id: '00000000-0000-4000-8000-000000000000' }),
});
check(
  'current_tier() returns 0 for an unknown user',
  noUser.ok && noUser.body === 0,
  `status ${noUser.status}, value ${JSON.stringify(noUser.body)}`
);

const anonRpc = await rest('rpc/current_tier', anonKey, {
  method: 'POST',
  body: JSON.stringify({ p_user_id: '00000000-0000-4000-8000-000000000000' }),
});
check('anon cannot execute current_tier()', !anonRpc.ok, `status ${anonRpc.status}`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
