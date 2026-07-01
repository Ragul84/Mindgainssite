const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

function loadEnv() {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  }
}

async function main() {
  loadEnv();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env');

  const res = await fetch(`${url}/functions/v1/thirukkural_prefill_batch`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'x-admin-key': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ start_kural: 1, end_kural: 1, langs: ['hi', 'te', 'kn', 'ml'] }),
  });
  console.log(`PREFILL_STATUS ${res.status}`);
  console.log((await res.text()).slice(0, 1200));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
