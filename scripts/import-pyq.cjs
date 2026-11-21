// Converts an export of mindwhite's Supabase view `pyq_verified_clean` (official-key /
// ticked-verified PYQs) into scripts/data/pyq.json for build-pyq.cjs.
// Usage: node scripts/import-pyq.cjs <export.json>
// The export is a JSON array of pyq_verified_clean rows (exam UPSC/TNPSC).
const fs = require('fs'), path = require('path');
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

// source_id -> [slug, paper title, answer-source label]
function paperOf(id) {
  let m;
  if ((m = id.match(/^upsc-cse-prelims-(\d{4})-gs1/))) return ['gs1', 'Prelims GS Paper I'];
  if ((m = id.match(/^upsc-csat-paper2-(\d{4})/))) return ['csat', 'Prelims CSAT (GS Paper II)'];
  if (/group1-prelims/.test(id)) return ['group-1', 'Group 1 Prelims'];
  if (/group2a-/.test(id)) return ['group-2a', 'Group 2A · General Studies'];
  if (/group2-.*tamil/.test(id)) return ['group-2-tamil', 'Group 2 Prelims · General Tamil'];
  if (/group2-/.test(id)) return ['group-2', 'Group 2 Prelims · General Studies'];
  if (/group4-.*tamil/.test(id)) return ['group-4-tamil', 'Group 4 · General Tamil'];
  if (/group4-/.test(id)) return ['group-4', 'Group 4 · General Studies'];
  if (/acf-prelims/.test(id)) return ['acf', 'Assistant Conservator of Forests Prelims · General Studies'];
  throw new Error('unknown source ' + id);
}

const out = [], skipped = [];
for (const r of rows) {
  if (!['UPSC', 'TNPSC'].includes(r.exam)) continue;
  const opts = Array.isArray(r.options) ? r.options.map((o) => String(o).trim()) : [];
  if (opts.length !== 4) { skipped.push(r.id); continue; }
  let a = opts.findIndex((o) => norm(o) === norm(r.answer_text));
  if (a < 0) { const l = String(r.answer_text).trim().match(/^\(?([a-dA-D])\)?$/); if (l) a = 'abcd'.indexOf(l[1].toLowerCase()); }
  let acc = null;
  if (r.nullified) {
    const set = (r.accepted_answers || []).map((x) => opts.findIndex((o) => norm(o) === norm(x))).filter((k) => k >= 0);
    acc = set.length ? [...new Set(set)].sort() : [0, 1, 2, 3];
    if (a < 0) a = acc[0];
  }
  if (a < 0) { skipped.push(r.id); continue; }
  const [slug, title] = paperOf(r.source_id);
  out.push({
    exam: r.exam.toLowerCase(), year: r.year, slug, paper: title,
    n: Number(r.question_number) || 0, q: String(r.question_text).trim(), opts, a,
    ...(acc ? { acc } : {}),
    src: r.answer_source === 'ticked-verified' ? 'ticked' : r.answer_source === 'official-key-ocr' ? 'key-ocr' : 'key',
  });
}
// Papers transcribed/fixed by hand (not yet correct in Supabase) override the export.
const ex = path.join(__dirname, 'data', 'pyq-extra.json');
if (fs.existsSync(ex)) {
  const { replace, rows: extra } = JSON.parse(fs.readFileSync(ex, 'utf8'));
  for (const [e, y, s] of replace) for (let i = out.length - 1; i >= 0; i--) if (out[i].exam === e && out[i].year === y && out[i].slug === s) out.splice(i, 1);
  out.push(...extra);
}
out.sort((x, y) => x.exam.localeCompare(y.exam) || y.year - x.year || x.slug.localeCompare(y.slug) || x.n - y.n);
fs.writeFileSync(path.join(__dirname, 'data', 'pyq.json'), JSON.stringify(out));
console.log('imported', out.length, 'skipped', skipped.length, skipped.join(' '));
