// Clean MindWhite Redis match items (Samacheer lists). Dry run by default; --write applies.
// 1) "match" items whose question is not a match question (pairs belong elsewhere): if their own options+answer
//    form a valid MCQ -> question_type "mcq", pairs/answer_key null; otherwise remove.
// 2) degenerate match items (every left or every right the same, fewer than 2 pairs, or rights are section numbers) -> remove.
// Safety: every write first checks LINDEX == the backed-up value; removals use LSET to a unique marker then LREM of that marker.
import fs from 'node:fs';
const WRITE = process.argv.includes('--write');
const env = Object.fromEntries(fs.readFileSync('C:/mindwhite/.env', 'utf8').split(/\r?\n/).filter(l => /^\s*[A-Z_]+=/.test(l)).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
const r = async (...a) => { const res = await fetch(env.UPSTASH_REDIS_REST_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(a) }); const j = await res.json(); if (j.error) throw new Error(j.error); return j.result; };
const B = JSON.parse(fs.readFileSync('C:/mindgains-waitlist/scripts/quiz-review/redis-backup-samacheer-2026-11-11.json', 'utf8'));
const plan = {}; const count = { toMcq: 0, removeMismatch: 0, removeDegenerate: 0 }; const ex = [];
for (const [k, L] of Object.entries(B)) L.forEach((raw, j) => {
  const o = JSON.parse(raw); if (String(o.question_type).toLowerCase() !== 'match') return;
  const t = String(o.question || o.question_text || '');
  const P = (o.pairs || []).filter(p => p && p.left && p.right);
  const opts = Array.isArray(o.options) ? o.options : [];
  if (!/\bmatch|\bpair|பொருத்து/i.test(t)) {
    const ok = opts.length >= 2 && Number.isInteger(o.answer_index) && o.answer_index >= 0 && o.answer_index < opts.length && new Set(opts.map(x => String(x).trim().toLowerCase())).size === opts.length;
    (plan[k] ||= []).push(ok ? { j, raw, act: 'mcq', next: JSON.stringify({ ...o, question_type: 'mcq', pairs: null, answer_key: null }) } : { j, raw, act: 'remove' });
    ok ? count.toMcq++ : count.removeMismatch++; return;
  }
  const R = P.map(p => String(p.right).trim().toLowerCase()), Lf = P.map(p => String(p.left).trim().toLowerCase());
  if (P.length === 0) return;                         // lists live in the question text: leave untouched
  const degenerate = P.length < 2 || new Set(R).size === 1 || new Set(Lf).size === 1 || R.every(x => /^\d+(\.\d+)?$/.test(x)) || Lf.every(x => /^\d+\.\d+$/.test(x));
  if (degenerate) { (plan[k] ||= []).push({ j, raw, act: 'remove' }); count.removeDegenerate++; if (ex.length < 8) ex.push(k.split(':').slice(2).join(':') + ' | ' + t.slice(0, 60) + ' | ' + JSON.stringify(P).slice(0, 110)); }
});
console.log(count, 'lists touched:', Object.keys(plan).length);
console.log(ex.join('\n'));
if (!WRITE) process.exit(0);
let changed = 0, skipped = 0, removed = 0;
for (const [k, items] of Object.entries(plan)) {
  const MARK = '__mg_remove__' + Date.now() + '_' + Math.random().toString(36).slice(2);
  let marks = 0;
  for (const it of items) {
    const cur = await r('LINDEX', k, it.j);
    if (cur !== it.raw) { skipped++; continue; }           // changed since the backup: leave it alone
    if (it.act === 'mcq') { await r('LSET', k, it.j, it.next); changed++; }
    else { await r('LSET', k, it.j, MARK); marks++; }
  }
  if (marks) { const n = await r('LREM', k, 0, MARK); removed += n; }
}
console.log({ convertedToMcq: changed, removed, skippedBecauseChanged: skipped });
