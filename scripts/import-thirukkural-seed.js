const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const seedPath = path.join(root, 'data', 'thirukkural_seed.json');

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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const rows = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  if (rows.length !== 1330) throw new Error(`Expected 1330 rows, got ${rows.length}`);

  let imported = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const res = await fetch(`${url}/rest/v1/thirukkural?on_conflict=kural_number`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase upsert failed at ${i}: ${res.status} ${text}`);
    }
    imported += batch.length;
    console.log(`THIRUKKURAL_IMPORT_PROGRESS ${imported}/${rows.length}`);
  }

  const countRes = await fetch(`${url}/rest/v1/thirukkural?select=kural_number`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  const range = countRes.headers.get('content-range') || '';
  console.log(`THIRUKKURAL_IMPORT_DONE rows=${imported} content_range=${range}`);
}

main().catch((err) => {
  console.error(err.message || err);
  if (err && err.cause) console.error(err.cause);
  process.exit(1);
});
