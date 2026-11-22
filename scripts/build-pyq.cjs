// Builds /pyq/ (hub), /pyq/tnpsc/<year>/<paper>/ and /pyq/upsc/<year>/[csat/] from scripts/data/pyq.json.
// pyq.json comes from mindwhite's verified PYQ layer (official keys): node scripts/import-pyq.cjs <export.json>
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const Q = require('./data/pyq.json');
const tpl = fs.readFileSync(path.join(ROOT, 'tnpsc/tamil/thirukkural/index.html'), 'utf8');
const HEADER = tpl.slice(tpl.indexOf('<header class="hh">'), tpl.indexOf('</header>') + 9);
const FOOTER = tpl.slice(tpl.indexOf('<footer class="mg-foot">'), tpl.indexOf('</footer>') + 9);
const HEADSTY = tpl.slice(tpl.indexOf('<link rel="preconnect"'), tpl.indexOf('</head>'))
  .replace(/<!-- MG_LEARNING_SCHEMA_START -->[\s\S]*?<!-- MG_LEARNING_SCHEMA_END -->/g, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').replace(/<link rel="canonical"[^>]*>/g, '');
const BENTO = tpl.slice(tpl.indexOf('<section class="ibento"'), tpl.indexOf('</section>', tpl.indexOf('<section class="ibento"')) + 10);
const SITE = 'https://mindgains.ai';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const L = 'ABCDE';
const CSS = `<style>
.py{max-width:880px;margin:0 auto}
.py .meta{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 0}.py .meta span{font:600 12.5px Inter;padding:6px 12px;border-radius:99px;background:#f1f5f7;color:#334155}
.py h2{font:800 clamp(22px,3.4vw,28px)/1.25 'Inter Tight',Inter;color:#0d1b2a;margin:34px 0 6px}
.py .sec-n{font:500 13px Inter;color:#94a3b8;margin:0 0 14px}
.pq{margin:0 0 12px!important}
.pq h3{font:650 16px/1.6 'Noto Sans Tamil',Inter!important}
.pq .o{display:grid;gap:6px;margin:10px 0 0}
.pq .o button{display:flex;gap:10px;align-items:baseline;padding:10px 12px;border-radius:10px;border:1px solid transparent;background:#f7f9fa;color:#0d1b2a;font:500 14.5px/1.5 'Noto Sans Tamil',Inter;text-align:left;cursor:pointer}
.pq .o button b{font:700 12px Inter;color:#94a3b8}
.pq .o button:hover{border-color:rgba(13,27,42,.15)}
.pq .o button.ok{background:#ecfdf5;border-color:#10b981;color:#065f46}.pq .o button.no{background:#fef2f2;border-color:#f87171;color:#991b1b}
.pq .ex{display:none;margin:10px 0 0;padding:10px 12px;border-left:3px solid #10b981;background:#f8fafc;font:400 14px/1.6 'Noto Sans Tamil',Inter;color:#334155}.pq.d .ex{display:block}
.yr{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.yr a{display:block;padding:18px;border-radius:16px;border:1px solid rgba(13,27,42,.08);background:#fff;color:#0d1b2a;text-decoration:none;transition:all .18s}
.yr a:hover{border-color:rgba(16,185,129,.4);transform:translateY(-1px)}
.yr a b{display:block;font:800 26px 'Inter Tight',Inter}.yr a small{color:#64748b;font:500 13px Inter}
.gap{display:inline-block;padding:6px 10px!important;margin:8px 0 0!important}.gap summary{cursor:pointer;color:#b45309;font:600 13px Inter;list-style:none}.gap summary::-webkit-details-marker{display:none}.gap[open]{display:block}.gap p{margin:8px 0 0}
.pq .fig{display:block;max-width:100%;height:auto;margin:10px 0 0;border-radius:8px;background:#fff}
.pq .uo{color:#b45309;font-size:13px}
.note{font:400 13px/1.6 Inter;color:#64748b;background:#f8fafc;border-radius:12px;padding:12px 14px;margin:18px 0 0}
</style>`;
const JS = `<script>document.querySelectorAll('.pq').forEach(function(q){q.querySelectorAll('.o button').forEach(function(b){b.onclick=function(){if(q.classList.contains('d'))return;q.classList.add('d');if(b.dataset.c)b.classList.add('ok');else{b.classList.add('no');q.querySelectorAll('[data-c]').forEach(function(c){c.classList.add('ok')})}}})})</script>`;
function page({ url, title, desc, crumbs, body, ld = [] }) {
  const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${SITE + url}" />
<meta property="og:type" content="article" /><meta property="og:site_name" content="MindGains" />
<meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${SITE + url}" /><meta property="og:image" content="${SITE}/assets/og-home.png" />
<meta name="twitter:card" content="summary_large_image" />
${HEADSTY}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@500;600&display=swap">
<script type="application/ld+json">${JSON.stringify(bc)}</script>
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
${CSS}
</head>
<body class="inner-v2">
${HEADER}
<main><nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${u}">${esc(n)}</a><span>›</span>`).join('')}</nav>
<div class="py">
${body}
${BENTO}
</div>
</main>
${FOOTER}
${JS}
<script defer src="/assets/pv.js"></script>
<script defer src="/assets/nav-mobile.js"></script>
</body>
</html>
`;
}
const hero = (chip, h1, p, meta) => `<section class="topic-hero"><div class="eyebrow-chip"><span class="dot-pulse"></span>${esc(chip)}</div><h1>${esc(h1)}</h1><p>${p}</p><div class="meta">${meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div></section>`;
const okSet = (q) => q.acc || [q.a];
const qcard = (q, i) => {
  const ok = okSet(q), grace = q.acc && q.acc.length === 4;
  const ans = grace ? `${q.exam.toUpperCase()} dropped this question and gave every candidate a grace mark, so all options count.`
    : q.acc && q.src === 'mg' ? `More than one option is correct: ${ok.map((k) => L[k] + '. ' + esc(q.opts[k])).join(' / ')}` : q.acc ? `${q.exam.toUpperCase()} accepted more than one answer: ${ok.map((k) => L[k] + '. ' + esc(q.opts[k])).join(' / ')}`
    : `Answer: ${L[q.a]}. ${esc(q.opts[q.a])}`;
  return `<article class="pq mg-seo-question"><h3>${q.n || i}. ${esc(q.q)}${q.src === "mg" && q.part ? " <small class=\"uo\" title=\"Unofficial answer\">⚠</small>" : ""}</h3>${q.img ? `<img class="fig" src="/pyq/img/${q.img}" alt="Figure for question ${q.n || i}" loading="lazy">` : ""}<div class="o">${q.opts.map((o, k) => `<button type="button"${ok.includes(k) ? ' data-c="1"' : ''}><b>${L[k]}</b><span>${esc(o)}</span></button>`).join('')}</div><div class="ex"><b>${ans}</b></div></article>`;
};
const out = (rel, html) => { const f = path.join(ROOT, rel, 'index.html'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const quizLd = (name, url, qs) => ({ '@context': 'https://schema.org', '@type': 'Quiz', name, url: SITE + url, inLanguage: 'en-IN', about: name, hasPart: qs.filter((q) => !q.acc).slice(0, 20).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.opts[q.a] } })) });
const MAIL = ' Spot a mistake? Write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.';
function srcNote(qs) {
  const body = qs[0].exam === 'upsc' ? 'UPSC' : 'TNPSC', nul = qs.filter((q) => q.acc).length;
  const mg = qs.filter((q) => q.src === 'mg').length;
  const s = mg ? (mg === qs.length ? 'Unofficial answers: worked out by MindGains, not from an official key.' : mg + ' answers are unofficial (worked out by MindGains, marked ⚠ on the question); the rest are verified answers.') : qs.some((q) => q.src === 'ticked')
    ? `Answers are taken from a candidate's ticked answer booklet and cross-checked by MindGains; ${body} has not published a key for this paper online.`
    : `Answers follow the official ${body} final answer key.`;
  return `<p class="note">${s}${nul ? ` ${nul} question${nul > 1 ? 's were' : ' was'} officially changed in the final key (more than one answer accepted, or a grace mark); those show every accepted option as correct.` : ''}${MAIL}</p>`;
}
const urls = ['/pyq/'];
const HOME = ['Home', '/'], HUB = ['Previous year questions', '/pyq/'];
const yrs = (qs) => [...new Set(qs.map((q) => q.year))].sort((a, b) => b - a);
const papersOf = (qs) => [...new Set(qs.map((q) => q.slug))].map((s) => qs.filter((q) => q.slug === s));
const card = (href, big, small) => `<a href="${href}"><b>${esc(big)}</b><small>${esc(small)}</small></a>`;
const tn = Q.filter((q) => q.exam === 'tnpsc'), up = Q.filter((q) => q.exam === 'upsc'), years = yrs(tn), uy = yrs(up);

// Missing-question explanations (shown in a tap-to-open note on incomplete papers)
const FULL = { gs1: 100, csat: 80, 'group-1': 200, acf: 200 };
const START = { 'tnpsc|2024|group-2-english': 101, 'tnpsc|2024|group-4': 101, 'tnpsc|2025|group-4': 101 };
const WHY = {
  'tnpsc|2014|group-2-english': 'TNPSC never published an official answer key for this paper. Answers come from a candidate\'s ticked answer booklet, checked by MindGains; questions the candidate left blank or marked unclearly could not be verified, so they are left out rather than guessed.',
  'tnpsc|2024|group-2': 'These questions are built around a diagram or figure that cannot be shown as text, so they are left out.',
  'tnpsc|2025|group-4': 'Q189 is a field-book survey diagram that cannot be shown as text, so it is left out.',
  'tnpsc|2025|group-1': 'Q194 is a multi-level fraction and Q200 asks about pictures of a cube; neither can be shown as text, so both are left out.',
  'tnpsc|2025|group-4-english': 'Q94 refers to a reading passage that is not printed in the question booklet, so it is left out.',
};
const DEF = { upsc: 'These questions have no answer in the official UPSC final key — UPSC usually deletes one to three questions every year after reviewing objections.', tnpsc: 'These questions have no usable answer in the official TNPSC final key (deleted after objections), so they are left out.' };
function gapNote(exam, y, ps) {
  const k = `${exam}|${y}|${ps[0].slug}`, full = FULL[ps[0].slug] || 100, s = START[k] || 1;
  const have = new Set(ps.map((q) => q.n)), miss = [];
  for (let i = s; i < s + full; i++) if (!have.has(i)) miss.push(i);
  if (!miss.length && !ps.some((q) => q.src === 'mg')) return '';
  if (ps.every((q) => q.src === 'mg') && k === 'tnpsc|2015|group-2-tamil') return '<details class="note gap"><summary title="About these answers">⚠ Unofficial · ' + ps.length + '/' + full + '</summary><p>Answers worked out by MindGains (no official key for this booklet). Left out: Q11 (none of the four options is right — all four words share the same opening letter), Q41 and Q77 (the statements as printed do not match any option cleanly), Q24 and Q97 (could not be confirmed from the faded scan).</p></details>';
  if (ps.every((q) => q.src === 'mg') && k === 'tnpsc|2024|group-4') return '<details class="note gap"><summary title="About these answers">⚠ Unofficial · ' + ps.length + '/' + full + '</summary><p>The official key for this paper was published for a different booklet version, so these answers were worked out by MindGains. Q136 is left out: none of its four options is correct (the swamp deer is the state animal of Uttar Pradesh and Madhya Pradesh).</p></details>';
  if (ps.every((q) => q.src === 'mg')) return '<details class="note gap"><summary title="About these answers" aria-label="About these answers">⚠ Unofficial' + (ps.length < full ? ' · ' + ps.length + '/' + full : '') + '</summary><p>The official key for this paper was published for a different booklet version, so these answers were worked out by MindGains.' + (ps.length < full ? ' Questions we could not read clearly from the scan, or could not answer with certainty, are left out' + '.' : '') + '</p></details>';
  if (!miss.length) { const u = ps.filter((q) => q.src === 'mg').map((q) => 'Q' + q.n); return `<details class="note gap"><summary title="About these answers">⚠ ${u.length} unofficial</summary><p>${u.join(', ')}: TNPSC never published an official key for this paper, so these answers were worked out by MindGains. The rest come from a candidate's ticked answer booklet, cross-checked.</p></details>`; }
  return `<details class="note gap"><summary title="Why some questions are missing" aria-label="Why some questions are missing">⚠ ${ps.length}/${full}</summary><p>Missing: ${miss.map((n) => 'Q' + n).join(', ')}.</p><p>${WHY[k] || WHY[`${exam}|${y}|${ps[0].slug.replace('-english', '')}`] || DEF[exam]}</p></details>`;
}
function paperPage(exam, y, ps, url, crumbs, siblings) {
  const mixed = ps.some((q) => q.src === "mg") && !ps.every((q) => q.src === "mg"); ps.forEach((q) => { q.part = mixed; });
  const name = `${exam.toUpperCase()} ${y} ${ps[0].paper}`;
  const body = hero(`${exam.toUpperCase()} · ${y}`, `${name}: Questions with Answers`, `All ${ps.length} questions from the ${name} paper, in paper order. Tap an option to check your answer instantly.`, [`${ps.length} questions`, ps.every((q) => q.src === 'mg') ? 'Unofficial answers' : ps.some((q) => q.src === 'ticked') ? 'Verified answers' : 'Official answer key']) + gapNote(exam, y, ps) +
    ps.map((q, i) => qcard(q, i + 1)).join('') + srcNote(ps) +
    (siblings.length ? `<h2>More ${exam.toUpperCase()} ${y} papers</h2><div class="yr">${siblings.join('')}</div>` : '');
  urls.push(url);
  out(url.slice(1, -1), page({ url, title: `${name} Question Paper with Answers (${ps.length} Qs) | MindGains`,
    desc: `${name} previous year question paper with answers: all ${ps.length} questions, tap to check each answer. Free.`, crumbs, body, ld: [quizLd(`${name} previous year questions`, url, ps)] }));
}

// TNPSC: /pyq/tnpsc/<year>/ lists papers, /pyq/tnpsc/<year>/<paper>/ holds the questions
for (const y of years) {
  const qs = tn.filter((q) => q.year === y), ps = papersOf(qs), url = `/pyq/tnpsc/${y}/`; urls.push(url);
  const cards = ps.map((p) => card(`${url}${p[0].slug}/`, p[0].paper.replace(/ · .*/, ''), `${p[0].paper.includes(' · ') ? p[0].paper.split(' · ')[1] + ' · ' : ''}${p.length} questions`));
  ps.forEach((p, k) => paperPage('tnpsc', y, p, `${url}${p[0].slug}/`, [HOME, HUB, ['TNPSC ' + y, url], [p[0].paper, `${url}${p[0].slug}/`]], cards.filter((_, j) => j !== k)));
  const body = hero('TNPSC · ' + y, `TNPSC ${y} Previous Year Question Papers with Answers`, `${qs.length} questions across ${ps.length} TNPSC ${y} paper${ps.length > 1 ? 's' : ''}. Pick a paper to practise it question by question.`, [`${qs.length} questions`, `${ps.length} paper${ps.length > 1 ? 's' : ''}`]) +
    `<h2>Papers</h2><div class="yr">${cards.join('')}</div>` +
    `<h2>Other years</h2><div class="yr">${years.filter((x) => x !== y).map((x) => card(`/pyq/tnpsc/${x}/`, x, `${tn.filter((q) => q.year === x).length} questions`)).join('')}${card('/pyq/upsc/', 'UPSC', 'Prelims papers')}</div>`;
  out(`pyq/tnpsc/${y}`, page({ url, title: `TNPSC ${y} Question Papers with Answers (${qs.length} Qs) | MindGains`,
    desc: `TNPSC ${y} previous year question papers with answers: ${ps.map((p) => p[0].paper).join(', ')}. ${qs.length} questions, free.`,
    crumbs: [HOME, HUB, ['TNPSC ' + y, url]], body }));
}
// UPSC: /pyq/upsc/ lists years, /pyq/upsc/<year>/ = GS Paper I, /pyq/upsc/<year>/csat/
for (const y of uy) {
  const ps = papersOf(up.filter((q) => q.year === y)), base = `/pyq/upsc/${y}/`;
  const href = (p) => p[0].slug === 'gs1' ? base : `${base}${p[0].slug}/`;
  const cards = ps.map((p) => card(href(p), p[0].slug === 'gs1' ? 'GS Paper I' : 'CSAT', `${p.length} questions`));
  ps.forEach((p, k) => paperPage('upsc', y, p, href(p), [HOME, HUB, ['UPSC', '/pyq/upsc/'], [`UPSC ${y}`, base], ...(p[0].slug === 'gs1' ? [] : [['CSAT', href(p)]])], cards.filter((_, j) => j !== k)));
}
{
  const url = '/pyq/upsc/'; urls.push(url);
  const body = hero('UPSC Prelims', 'UPSC Prelims Previous Year Question Papers with Answers', `Every UPSC Civil Services prelims General Studies paper from ${uy[uy.length - 1]} to ${uy[0]}, with the official UPSC answer key. ${up.length} questions in all.`, [`${up.length} questions`, `${uy[uy.length - 1]}–${uy[0]}`, 'Official answer keys']) +
    `<h2>GS Paper I by year</h2><div class="yr">${uy.map((y) => card(`/pyq/upsc/${y}/`, y, `${up.filter((q) => q.year === y && q.slug === 'gs1').length} questions`)).join('')}</div>` +
    `<h2>CSAT (GS Paper II)</h2><div class="yr">${uy.filter((y) => up.some((q) => q.year === y && q.slug === 'csat')).map((y) => card(`/pyq/upsc/${y}/csat/`, y, `${up.filter((q) => q.year === y && q.slug === 'csat').length} questions`)).join('')}</div>` +
    `<h2>TNPSC by year</h2><div class="yr">${years.map((x) => card(`/pyq/tnpsc/${x}/`, x, `TNPSC · ${tn.filter((q) => q.year === x).length} questions`)).join('')}</div>`;
  out('pyq/upsc', page({ url, title: `UPSC Prelims Question Papers ${uy[uy.length - 1]}–${uy[0]} with Answers | MindGains`,
    desc: `UPSC prelims GS Paper I and CSAT previous year papers ${uy[uy.length - 1]}–${uy[0]} with official answer keys, year by year. Free.`,
    crumbs: [HOME, HUB, ['UPSC', url]], body }));
}
// hub
out('pyq', page({ url: '/pyq/', title: 'TNPSC & UPSC Previous Year Question Papers with Answers | MindGains',
  desc: `Full TNPSC and UPSC prelims previous year question papers with official answer keys, year-wise. ${Q.length} questions, free.`,
  crumbs: [HOME, HUB],
  body: hero('Previous year questions', 'Previous Year Question Papers, Year-wise', `Full TNPSC and UPSC prelims papers with answers from the official keys. ${Q.length.toLocaleString('en-IN')} questions.`, [`${Q.length.toLocaleString('en-IN')} questions`, 'TNPSC', 'UPSC']) +
    `<h2>TNPSC</h2><div class="yr">${years.map((x) => card(`/pyq/tnpsc/${x}/`, x, `${tn.filter((q) => q.year === x).length} questions`)).join('')}</div>` +
    `<h2>UPSC prelims</h2><div class="yr">${uy.map((y) => card(`/pyq/upsc/${y}/`, y, `${up.filter((q) => q.year === y).length} questions`)).join('')}</div>` }));
// sitemap
const smP = path.join(ROOT, 'sitemap.xml'); let sm = fs.readFileSync(smP, 'utf8');
sm = sm.replace(/\s*<!-- PYQ_START -->[\s\S]*?<!-- PYQ_END -->/, '');
sm = sm.replace('</urlset>', `  <!-- PYQ_START -->\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n  <!-- PYQ_END -->\n</urlset>`);
fs.writeFileSync(smP, sm);
console.log('pages', urls);
