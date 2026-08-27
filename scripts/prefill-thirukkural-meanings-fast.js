const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

const LANGS = {
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

function loadEnv() {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translate(text, target, sarvamKey) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    let res;
    try {
      res = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: target,
          model: 'mayura:v1',
        }),
      });
    } catch (err) {
      const wait = Math.min(120000, 15000 * attempt);
      console.log(`SARVAM_NETWORK_RETRY target=${target} attempt=${attempt} wait=${wait}`);
      await sleep(wait);
      continue;
    }
    const payloadText = await res.text();
    if (res.ok) {
      const payload = JSON.parse(payloadText);
      return payload.translated_text || '';
    }
    if (/rate limit|rate_limit|too many/i.test(payloadText)) {
      const wait = Math.min(120000, 20000 * attempt);
      console.log(`SARVAM_RATE_LIMIT target=${target} attempt=${attempt} wait=${wait}`);
      await sleep(wait);
      continue;
    }
    throw new Error(`Sarvam ${res.status}: ${payloadText}`);
  }
  throw new Error(`Sarvam retry exhausted for ${target}`);
}

async function supabaseFetch(url, key, query) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const res = await fetch(`${url}/rest/v1/${query}`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      return res.json();
    } catch (err) {
      if (attempt === 6) throw err;
      const wait = 10000 * attempt;
      console.log(`SUPABASE_FETCH_RETRY attempt=${attempt} wait=${wait}`);
      await sleep(wait);
    }
  }
}

async function updateRow(url, key, kuralNumber, updates) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const res = await fetch(`${url}/rest/v1/thirukkural?kural_number=eq.${kuralNumber}`, {
        method: 'PATCH',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Update ${kuralNumber} failed: ${res.status} ${await res.text()}`);
      return;
    } catch (err) {
      if (attempt === 6) throw err;
      const wait = 10000 * attempt;
      console.log(`SUPABASE_UPDATE_RETRY kural=${kuralNumber} attempt=${attempt} wait=${wait}`);
      await sleep(wait);
    }
  }
}

async function main() {
  loadEnv();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sarvamKey = process.env.SARVAM_API_KEY;
  if (!url || !key || !sarvamKey) throw new Error('Missing Supabase or Sarvam env');

  const langs = (process.argv[2] ? process.argv[2].split(',') : Object.keys(LANGS)).map((v) => v.trim()).filter(Boolean);
  for (const lang of langs) {
    const target = LANGS[lang];
    if (!target) throw new Error(`Unsupported language ${lang}`);
    let completed = 0;
    for (let start = 0; start < 1330; start += 200) {
      const end = Math.min(start + 199, 1329);
      const rows = await supabaseFetch(
        url,
        key,
        `thirukkural?select=kural_number,meaning_english,meaning_${lang}&order=kural_number.asc&limit=200&offset=${start}`,
      );
      for (const row of rows) {
        if (row[`meaning_${lang}`]) {
          completed += 1;
          continue;
        }
        const source = row.meaning_english || '';
        if (!source.trim()) continue;
        const translated = await translate(source, target, sarvamKey);
        await updateRow(url, key, row.kural_number, { [`meaning_${lang}`]: translated });
        completed += 1;
        console.log(`THIRUKKURAL_MEANING_FILLED lang=${lang} kural=${row.kural_number} done=${completed}/1330`);
        await sleep(300);
      }
      console.log(`THIRUKKURAL_MEANING_PAGE_DONE lang=${lang} range=${start + 1}-${end + 1}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
