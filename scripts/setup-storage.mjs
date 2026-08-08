/**
 * Creates / reconciles the Supabase Storage buckets. Idempotent — safe to re-run.
 *
 *   node --env-file=.env scripts/setup-storage.mjs
 *
 * Bucket layout:
 *   watch-reports  public   free Watch Reports + manifest.json (replaces the R2 bucket)
 *   pro-content    private  PRO PDFs / MP3s / MP4s, only ever reached via signed URLs
 *
 * NOTE ON SIZE LIMITS: the Supabase Free plan caps uploads at 50MB and will not
 * accept a higher per-bucket limit. On Pro, raise the *global* limit in Storage
 * Settings first, then bump PRO_MAX_BYTES below and re-run.
 */

const FREE_PLAN_MAX_BYTES = 50 * 1024 * 1024; // 50MB

const BUCKETS = [
  {
    id: 'watch-reports',
    public: true,
    file_size_limit: FREE_PLAN_MAX_BYTES,
  },
  {
    id: 'pro-content',
    public: false,
    file_size_limit: FREE_PLAN_MAX_BYTES,
  },
];

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Run with: node --env-file=.env scripts/setup-storage.mjs');
  process.exit(1);
}

const base = `${url.replace(/\/+$/, '')}/storage/v1`;
const headers = {
  'Content-Type': 'application/json',
  apikey: key,
  Authorization: `Bearer ${key}`,
};

async function api(path, init = {}) {
  const res = await fetch(`${base}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // Never interpolate `key` into output.
    throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

const existing = await api('/bucket');
const existingIds = new Set(existing.map((b) => b.id));

for (const bucket of BUCKETS) {
  if (existingIds.has(bucket.id)) {
    await api(`/bucket/${bucket.id}`, { method: 'PUT', body: JSON.stringify(bucket) });
    console.log(`updated  ${bucket.id.padEnd(14)} public=${bucket.public}`);
  } else {
    await api('/bucket', { method: 'POST', body: JSON.stringify({ name: bucket.id, ...bucket }) });
    console.log(`created  ${bucket.id.padEnd(14)} public=${bucket.public}`);
  }
}

const after = await api('/bucket');
console.log('\nBuckets now present:');
for (const b of after) {
  const limit = b.file_size_limit ? `${(b.file_size_limit / 1024 / 1024).toFixed(0)}MB` : 'global';
  console.log(`  ${b.id.padEnd(14)} ${b.public ? 'public ' : 'private'}  limit=${limit}`);
}
