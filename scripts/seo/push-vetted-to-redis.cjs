/**
 * Push the vetted quiz content into Upstash Redis so the mindwhite app serves it
 * too. Creds read from C:/mindwhite/.env (UPSTASH_REDIS_REST_URL / _TOKEN).
 *
 * Appends (RPUSH) only questions whose text isn't already in the target list.
 * Items are stored as the 5 fields app + web both use.
 *
 *   error-spotting  80 -> quiz:subject:english:ssc:grammar        (append)
 *   idioms          14 -> quiz:subject:english:ssc:vocabulary     (append)
 *   fundamental-... 16 -> quiz:subject:polity:ssc:constitution    (append)
 *   average         20 -> quiz:subject:maths:ssc:average          (new key)
 *   classification  18 -> quiz:subject:reasoning:ssc:classification (new key)
 *
 * Run:  node scripts/seo/push-vetted-to-redis.cjs           (dry run, shows counts)
 *       node scripts/seo/push-vetted-to-redis.cjs --commit   (actually RPUSH)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const R = (...p) => path.join(ROOT, ...p);
const COMMIT = process.argv.includes('--commit');

// ---- creds ----
const envTxt = fs.readFileSync('C:/mindwhite/.env', 'utf8');
const get = (k) => (envTxt.match(new RegExp('^' + k + '=(.+)$', 'm')) || [])[1]?.trim();
const URL = get('UPSTASH_REDIS_REST_URL');
const TOKEN = get('UPSTASH_REDIS_REST_TOKEN');
if (!URL || !TOKEN) throw new Error('Redis creds not found in C:/mindwhite/.env');

async function cmd(args) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const j = await res.json();
  if (j.error) throw new Error(`${args[0]} ${args[1]}: ${j.error}`);
  return j.result;
}

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();
const slim = (q) => JSON.stringify({
  question: q.question, options: q.options, answer_index: q.answer_index,
  explanation: q.explanation, difficulty: q.difficulty || 'medium',
});

const errorSpotting = JSON.parse(fs.readFileSync(R('scripts/seo/content/ssc-english-error-spotting.json'), 'utf8')).questions;
const ct = JSON.parse(fs.readFileSync(R('scripts/seo/cross-topic-validation-batch-ssc.json'), 'utf8')).sections;

const JOBS = [
  { key: 'quiz:subject:english:ssc:grammar', items: errorSpotting, label: 'error-spotting -> grammar' },
  { key: 'quiz:subject:english:ssc:vocabulary', items: ct['ssc-english-idioms-phrases'].questions, label: 'idioms -> vocabulary' },
  { key: 'quiz:subject:polity:ssc:constitution', items: ct['ssc-polity-fundamental-rights'].questions, label: 'fundamental-rights -> constitution' },
  { key: 'quiz:subject:maths:ssc:average', items: ct['ssc-quant-average'].questions, label: 'average (new key)' },
  { key: 'quiz:subject:reasoning:ssc:classification', items: ct['ssc-reasoning-classification'].questions, label: 'classification (new key)' },
];

(async () => {
  console.log(await cmd(['PING']) === 'PONG' ? 'redis: PONG' : 'redis: ??', COMMIT ? '(COMMIT)' : '(dry run)');
  for (const job of JOBS) {
    const before = await cmd(['LLEN', job.key]) || 0;
    const existing = before > 0 ? await cmd(['LRANGE', job.key, 0, -1]) : [];
    const seen = new Set(existing.map((r) => {
      try { return norm(JSON.parse(r).question || JSON.parse(r).question_text || ''); } catch { return ''; }
    }));
    const fresh = job.items.filter((q) => !seen.has(norm(q.question)));
    console.log(`\n${job.label}`);
    console.log(`  key: ${job.key}`);
    console.log(`  LLEN before: ${before}  |  vetted: ${job.items.length}  |  new (non-dup): ${fresh.length}`);
    if (COMMIT && fresh.length) {
      // RPUSH in chunks of 40
      for (let i = 0; i < fresh.length; i += 40) {
        const chunk = fresh.slice(i, i + 40).map(slim);
        await cmd(['RPUSH', job.key, ...chunk]);
      }
      const after = await cmd(['LLEN', job.key]);
      console.log(`  LLEN after:  ${after}  (+${after - before})`);
    }
  }
  if (!COMMIT) console.log('\n(dry run — re-run with --commit to write)');
})();
