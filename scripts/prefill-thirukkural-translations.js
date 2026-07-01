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

  const initialStart = Number(process.argv[2] || 1);
  const end = Number(process.argv[3] || 1330);
  const langs = (process.argv[4] ? process.argv[4].split(',') : ['hi', 'te', 'kn', 'ml']).map((v) => v.trim()).filter(Boolean);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const lang of langs) {
    let start = initialStart;
    while (start <= end) {
      const res = await fetch(`${url}/functions/v1/thirukkural_prefill_batch`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'x-admin-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start_kural: start, end_kural: end, langs: [lang] }),
      });
      const text = await res.text();
      if (!res.ok) {
        const rateLimited = /rate limit|rate_limit|too many/i.test(text);
        if (rateLimited) {
          console.log(`THIRUKKURAL_RATE_LIMIT lang=${lang} start=${start} waiting=65000ms`);
          await sleep(65000);
          continue;
        }
        throw new Error(`Prefill failed for ${lang} at ${start}: ${res.status} ${text}`);
      }
      const payload = JSON.parse(text);
      console.log(`THIRUKKURAL_TRANSLATION_BATCH lang=${lang} start=${start} next=${payload.next_start} done=${payload.done}`);
      if (payload.done) break;
      start = payload.next_start;
      await sleep(2500);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
