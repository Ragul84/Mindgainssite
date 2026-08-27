const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnv(envPath);
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env');

  const rows = [];
  let contentRange = '';
  for (let start = 0; start < 1330; start += 500) {
    const end = Math.min(start + 499, 1329);
    const res = await fetch(`${url}/rest/v1/thirukkural?select=kural_number,meaning_hi,meaning_te,meaning_kn,meaning_ml&order=kural_number.asc`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'count=exact',
        Range: `${start}-${end}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    contentRange = res.headers.get('content-range') || contentRange;
    rows.push(...await res.json());
  }
  const missing = { hi: 0, te: 0, kn: 0, ml: 0 };
  for (const row of rows) {
    if (!row.meaning_hi) missing.hi += 1;
    if (!row.meaning_te) missing.te += 1;
    if (!row.meaning_kn) missing.kn += 1;
    if (!row.meaning_ml) missing.ml += 1;
  }
  console.log(`THIRUKKURAL_DB_COUNT ${rows.length}`);
  console.log(`THIRUKKURAL_CONTENT_RANGE ${contentRange}`);
  console.log(`THIRUKKURAL_MISSING_TRANSLATIONS ${JSON.stringify(missing)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
