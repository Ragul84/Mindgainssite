// Builds /pyq/ (hub), /pyq/tnpsc/<year>/ and /pyq/upsc/ from scripts/data/pyq.json.
// pyq.json = only questions whose source is NOT the AI generator (edu4bharat "generated"/"trusted_archive"),
// de-duplicated, with broken scans dropped. Re-run: node scripts/build-pyq.cjs
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
.note{font:400 13px/1.6 Inter;color:#64748b;background:#f8fafc;border-radius:12px;padding:12px 14px;margin:18px 0 0}
</style>`;
const JS = `<script>document.querySelectorAll('.pq').forEach(function(q){q.querySelectorAll('.o button').forEach(function(b){b.onclick=function(){if(q.classList.contains('d'))return;q.classList.add('d');if(b.dataset.c)b.classList.add('ok');else{b.classList.add('no');var c=q.querySelector('[data-c]');c&&c.classList.add('ok')}}})})</script>`;
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
const qcard = (q, i) => `<article class="pq mg-seo-question"><h3>${i}. ${esc(q.q)}</h3><div class="o">${q.opts.map((o, k) => `<button type="button"${k === q.a ? ' data-c="1"' : ''}><b>${L[k]}</b><span>${esc(o)}</span></button>`).join('')}</div><div class="ex"><b>Answer: ${L[q.a]}. ${esc(q.opts[q.a])}</b>${q.ex ? '<br>' + esc(q.ex) : ''}</div></article>`;
const PAPER = (p) => ({ 'Group 4': 'Group 4 (General Studies)', 'Tamil': 'General Tamil (பொதுத் தமிழ்)', 'Aptitude and Mental Ability': 'Aptitude & Mental Ability' }[p] || p || 'General Studies');
const out = (rel, html) => { const f = path.join(ROOT, rel, 'index.html'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const quizLd = (name, url, qs) => ({ '@context': 'https://schema.org', '@type': 'Quiz', name, url: SITE + url, inLanguage: 'en-IN', about: name, hasPart: qs.slice(0, 20).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.opts[q.a] } })) });
const NOTE = '<p class="note">Questions as they appeared in the exam paper (scanned and cleaned). Tap an option to see the answer. If you spot a wrong answer or a typo, write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.</p>';
const NOTE24 = '<p class="note">Questions from four TNPSC 2024 papers. <b>Group 1 prelims (13 July 2024):</b> answers are from the official TNPSC final answer key (booklet version A); questions the key marks with more than one answer were left out. <b>Group 4 (9 June 2024) and Group 2 prelims (14 September 2024):</b> TNPSC publishes its key for a different booklet version, so those answers were worked out by MindGains, and unclear questions were left out. Spot a mistake? Write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.</p>';
const NOTEG1 = (d) => '<p class="note">Group 1 prelims (' + d + ') answers follow the official TNPSC final key; questions the key dropped or gave more than one answer for are left out. The other questions this year come from our archive of past papers. Spot a mistake? Write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.</p>';
const NOTE22 ='<p class="note">Group 1 prelims (19 November 2022) and Group 4 (24 July 2022) answers follow the official TNPSC final key; questions the key dropped or gave more than one answer for are left out. The other 2022 questions come from our archive of past papers. Spot a mistake? Write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.</p>';
const NOTE25 ='<p class="note">Questions from the TNPSC Group 4 exam held on 12 July 2025 (General Tamil and General Studies). The official TNPSC key is published for a different booklet version, so the answers here were worked out by MindGains; questions where the scan was unclear or the answer was uncertain are left out. Spot a mistake? Write to <a href="mailto:contact@mindgains.ai">contact@mindgains.ai</a>.</p>';
const urls = ['/pyq/'];
const HOME = ['Home', '/'], HUB = ['Previous year questions', '/pyq/'];

// TNPSC by year
const tn = Q.filter((q) => q.exam === 'tnpsc'), years = [...new Set(tn.map((q) => q.year))].sort((a, b) => b - a);
for (const y of years) {
  const qs = tn.filter((q) => q.year === y), papers = [...new Set(qs.map((q) => q.paper))];
  const url = `/pyq/tnpsc/${y}/`; urls.push(url);
  let i = 0;
  const body = hero('TNPSC · ' + y, `TNPSC ${y} Previous Year Questions with Answers`, `${qs.length} questions from the TNPSC ${y} papers, grouped by paper. Tap an option to check your answer instantly.`, [`${qs.length} questions`, ...papers.map(PAPER)]) +
    papers.map((p) => { const ps = qs.filter((q) => q.paper === p); return `<h2>${esc(PAPER(p))}</h2><p class="sec-n">${ps.length} questions</p>` + ps.map((q) => qcard(q, ++i)).join(''); }).join('') + (y === 2024 ? NOTE24 : y === 2025 ? NOTE25 : y === 2022 ? NOTE22 : y === 2021 ? NOTEG1('3 January 2021') : y === 2019 ? NOTEG1('3 March 2019') .replace('prelims (3 March 2019)','prelims (3 March 2019) and Group 4 (1 September 2019)') : NOTE) +
    `<h2>Other years</h2><div class="yr">${years.filter((x) => x !== y).map((x) => `<a href="/pyq/tnpsc/${x}/"><b>${x}</b><small>${tn.filter((q) => q.year === x).length} questions</small></a>`).join('')}<a href="/pyq/upsc/"><b>UPSC</b><small>Prelims GS questions</small></a></div>`;
  out(`pyq/tnpsc/${y}`, page({ url, title: `TNPSC ${y} Previous Year Questions with Answers (${qs.length} Qs) | MindGains`,
    desc: `TNPSC ${y} previous year question paper questions with answers: ${papers.map(PAPER).join(', ')}. ${qs.length} questions, tap to check each answer. Free.`,
    crumbs: [HOME, HUB, ['TNPSC ' + y, url]], body, ld: [quizLd(`TNPSC ${y} previous year questions`, url, qs)] }));
}
// UPSC (one page, by year)
{
  const up = Q.filter((q) => q.exam === 'upsc'), uy = [...new Set(up.map((q) => q.year))].sort((a, b) => b - a), url = '/pyq/upsc/'; urls.push(url);
  let i = 0;
  const body = hero('UPSC Prelims', 'UPSC Prelims Previous Year Questions (GS Paper I)', `${up.length} UPSC prelims General Studies questions from ${uy[uy.length - 1]}–${uy[0]}, by year. Tap an option to check your answer.`, [`${up.length} questions`, `${uy[uy.length - 1]}–${uy[0]}`, 'GS Paper I']) +
    uy.map((y) => { const ys = up.filter((q) => q.year === y); return `<h2>UPSC ${y}</h2><p class="sec-n">${ys.length} questions</p>` + ys.map((q) => qcard(q, ++i)).join(''); }).join('') + NOTE +
    `<h2>TNPSC by year</h2><div class="yr">${years.map((x) => `<a href="/pyq/tnpsc/${x}/"><b>${x}</b><small>TNPSC · ${tn.filter((q) => q.year === x).length} questions</small></a>`).join('')}</div>`;
  out('pyq/upsc', page({ url, title: `UPSC Prelims Previous Year Questions ${uy[uy.length - 1]}–${uy[0]} with Answers | MindGains`,
    desc: `UPSC prelims GS Paper I previous year questions ${uy[uy.length - 1]}–${uy[0]} with answers, year by year. Free, tap to check each answer.`,
    crumbs: [HOME, HUB, ['UPSC', url]], body, ld: [quizLd('UPSC prelims previous year questions', url, up)] }));
}
// hub
out('pyq', page({ url: '/pyq/', title: 'TNPSC & UPSC Previous Year Questions with Answers, Year-wise | MindGains',
  desc: `Year-wise previous year questions with answers: TNPSC ${years.join(', ')} and UPSC prelims. ${Q.length} questions, free.`,
  crumbs: [HOME, HUB],
  body: hero('Previous year questions', 'Previous Year Questions, Year-wise', `Real questions from past TNPSC and UPSC papers, with answers. ${Q.length} questions so far; more years are being added.`, [`${Q.length} questions`, 'TNPSC', 'UPSC']) +
    `<h2>TNPSC</h2><div class="yr">${years.map((x) => `<a href="/pyq/tnpsc/${x}/"><b>${x}</b><small>${tn.filter((q) => q.year === x).length} questions</small></a>`).join('')}</div><h2>UPSC</h2><div class="yr"><a href="/pyq/upsc/"><b>Prelims</b><small>GS Paper I</small></a></div>` }));
// sitemap
const smP = path.join(ROOT, 'sitemap.xml'); let sm = fs.readFileSync(smP, 'utf8');
sm = sm.replace(/\s*<!-- PYQ_START -->[\s\S]*?<!-- PYQ_END -->/, '');
sm = sm.replace('</urlset>', `  <!-- PYQ_START -->\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n  <!-- PYQ_END -->\n</urlset>`);
fs.writeFileSync(smP, sm);
console.log('pages', urls);
