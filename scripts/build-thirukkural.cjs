// Builds /thirukkural/ (hub), /thirukkural/<1..133>/ (adhikaram pages with a 10-question quiz)
// and /thirukkural/kural/<1..1330>/ (one page per kural with a 3-question quiz).
// Data: scripts/data/thirukkural.json (kural text is public domain; English = G.U. Pope 1886, public domain).
// Re-run: node scripts/build-thirukkural.cjs  (also rewrites the thirukkural block in sitemap.xml)
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { chapters, kurals } = require('./data/thirukkural.json');
const tpl = fs.readFileSync(path.join(ROOT, 'tnpsc/tamil/thirukkural/index.html'), 'utf8');
const HEADER = tpl.slice(tpl.indexOf('<header class="hh">'), tpl.indexOf('</header>') + 9);
const FOOTER = tpl.slice(tpl.indexOf('<footer class="mg-foot">'), tpl.indexOf('</footer>') + 9);
const SITE = 'https://mindgains.ai';
const HEADSTY = tpl.slice(tpl.indexOf('<link rel="preconnect"'), tpl.indexOf('</head>'))
  .replace(/<!-- MG_LEARNING_SCHEMA_START -->[\s\S]*?<!-- MG_LEARNING_SCHEMA_END -->/g, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  .replace(/<link rel="canonical"[^>]*>/g, '');
const BENTO = tpl.slice(tpl.indexOf('<section class="ibento"'), tpl.indexOf('</section>', tpl.indexOf('<section class="ibento"')) + 10);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PORUL = {};
for (const f of fs.readdirSync(path.join(__dirname, 'data')).filter((f) => /^tk-porul-\d+\.txt$/.test(f)))
  for (const line of fs.readFileSync(path.join(__dirname, 'data', f), 'utf8').split(/\r?\n/)) { const m = line.match(/^(\d+)\|(.+)$/); if (m) PORUL[+m[1]] = m[2].trim(); }
const K = (n) => kurals[n - 1];
const chOf = (n) => chapters[Math.ceil(n / 10) - 1];
// deterministic PRNG so rebuilds produce identical pages
let seed = 1; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, n, not) => shuffle(arr.filter((x) => !not.includes(x))).slice(0, n);
const words = (k) => (k.l1 + ' ' + k.l2).replace(/[.,;!?]/g, '').split(/\s+/).filter((w) => w.length > 2);

// ---- question makers (all answers come straight from the text, nothing invented)
function qBlank(k) {
  const ws = words(k); const w = ws[Math.floor(rnd() * ws.length)];
  const pool = [...new Set(chapters[Math.ceil(k.n / 10) - 1] && kurals.slice(chOf(k.n).s - 1, chOf(k.n).e).filter((x) => x.n !== k.n).flatMap(words))].filter((x) => x !== w && !words(k).includes(x));
  const text = (k.l1 + ' / ' + k.l2).replace(w, '______');
  return { q: `விடுபட்ட சொல்லை நிரப்புக: <span class="kq">${esc(text)}</span>`, opts: shuffle([w, ...pick(pool, 3, [w])]), a: w };
}
function qChapter(k) {
  const c = chOf(k.n);
  const others = pick(chapters.filter((x) => x.paal.n === c.paal.n), 3, [c]).map((x) => x.ta);
  return { q: `இந்தக் குறள் எந்த அதிகாரத்தைச் சேர்ந்தது? <span class="kq">${esc(k.l1)} / ${esc(k.l2)}</span>`, opts: shuffle([c.ta, ...others]), a: c.ta };
}
function qMeaning(k) {
  const c = chOf(k.n); const sib = kurals.slice(c.s - 1, c.e).filter((x) => x.n !== k.n);
  const opts = shuffle([k, ...pick(sib, 3, [])]);
  return { q: `Which kural does this English translation (G.U. Pope) belong to? <span class="kq en">"${esc(k.pope)}"</span>`, opts: opts.map((x) => x.l1), a: k.l1 };
}
function qPorul(k) {
  const c = chOf(k.n); const sib = kurals.slice(c.s - 1, c.e).filter((x) => x.n !== k.n && PORUL[x.n]);
  return { q: `இந்தக் குறளின் பொருள் எது? <span class="kq">${esc(k.l1)} / ${esc(k.l2)}</span>`, opts: shuffle([PORUL[k.n], ...pick(sib, 3, []).map((x) => PORUL[x.n])]), a: PORUL[k.n] };
}
function quizHTML(qs, title) {
  return `<section class="tkq mg-seo-study" aria-label="${esc(title)}"><p class="mg-seo-kicker">Quiz</p><h2>${esc(title)}</h2><p class="tkq-s"><b class="tkq-sc">0</b> / ${qs.length} சரி</p><div class="mg-seo-questions">
${qs.map((x, i) => `<article class="tkq-i mg-seo-question"><h3><b>${i + 1}.</b> ${x.q}</h3><div class="tkq-o">${x.opts.map((o) => `<button type="button"${o === x.a ? ' data-c="1"' : ''}>${esc(o)}</button>`).join('')}</div></article>`).join('\n')}
</div></section>`;
}
const QJS = `<script>document.querySelectorAll('.tkq').forEach(function(s){var sc=s.querySelector('.tkq-sc'),n=0;s.querySelectorAll('.tkq-i').forEach(function(it){it.querySelectorAll('button').forEach(function(b){b.onclick=function(){if(it.dataset.d)return;it.dataset.d=1;var ok=b.dataset.c;b.classList.add(ok?'ok':'no');if(!ok){var c=it.querySelector('[data-c]');c&&c.classList.add('ok')}else{sc.textContent=++n}}})})})</script>`;

const CSS = `<style>
.tk{max-width:880px;margin:0 auto}
.tk .meta{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 0}.tk .meta span{font:600 12.5px Inter;padding:6px 12px;border-radius:99px;background:#f1f5f7;color:#334155}
/* kural card: reading-first */
.kc{position:relative;display:grid;grid-template-columns:64px 1fr;gap:0 22px;padding:28px 30px 26px;margin:0 0 16px!important;border-radius:22px;background:#fff;border:1px solid rgba(13,27,42,.07);box-shadow:0 1px 2px rgba(13,27,42,.04),0 8px 24px -14px rgba(13,27,42,.12);text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s,border-color .2s}
a.kc:hover{transform:translateY(-2px);border-color:rgba(16,185,129,.35);box-shadow:0 2px 4px rgba(13,27,42,.05),0 18px 36px -18px rgba(13,27,42,.22)}
.kc .kn{grid-row:1/span 5;align-self:start;display:flex;flex-direction:column;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:linear-gradient(160deg,#ecfdf5,#d1fae5);color:#047857;font:800 22px/1 'Inter Tight',Inter;letter-spacing:-.02em}
.kc .kn small{font:700 11px "Noto Sans Tamil",Inter;letter-spacing:0;color:#059669;margin-bottom:4px}
.kc .ta{font:600 21px/1.75 'Noto Serif Tamil','Noto Sans Tamil',serif;color:#0b1320;margin:4px 0 20px;text-align:center;letter-spacing:.005em}
.kc .tr{font:400 13px/1.55 Inter;color:#94a3b8;margin:0 0 18px;letter-spacing:.01em}
.kc .po{margin:0 0 14px;padding:0 0 0 16px;border-left:3px solid #10b981;font:500 16.5px/1.85 'Noto Sans Tamil',Inter;color:#1e293b}
.kc .lbl{display:block;font:700 10.5px Inter;letter-spacing:.14em;text-transform:uppercase;color:#059669;margin:0 0 4px}.kc .po .lbl{font:700 13px "Noto Sans Tamil",Inter;letter-spacing:0;text-transform:none}
.kc .en{padding:0 0 0 16px;border-left:3px solid #e2e8f0;font:italic 400 17px/1.6 'Instrument Serif',Georgia,serif;color:#475569}
.kc .en .lbl{font-style:normal;color:#94a3b8}
.kc .go{position:absolute;top:26px;right:26px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#94a3b8;background:#f8fafc;transition:all .2s}
a.kc:hover .go{background:#10b981;color:#fff}
.kbig{padding:36px 38px}.kbig .ta{font-size:clamp(23px,4.6vw,29px)}
@media(max-width:640px){.kc{grid-template-columns:1fr;padding:22px 20px;gap:0}.kc .kn{grid-row:auto;flex-direction:row;gap:6px;width:auto;height:auto;padding:6px 12px;border-radius:99px;justify-self:start;font-size:15px;margin:0 0 14px}.kc .kn small{margin:0}.kc .ta{font-size:19px}.kbig{padding:24px 20px}.kc .go{top:20px;right:18px}}
.jump{display:inline-flex;align-items:center;gap:8px;margin:14px 0 0;padding:10px 16px;border-radius:12px;background:#0d1b2a;color:#fff!important;font:600 14px Inter;text-decoration:none}
.ks-head{display:flex;align-items:baseline;justify-content:space-between;margin:34px 0 14px}.ks-head h2{margin:0!important}.ks-head span{font:500 13px Inter;color:#94a3b8}
.tk h2{font:700 22px/1.3 'Inter Tight',Inter;color:#0d1b2a;margin:30px 0 12px}
.paal{margin:40px 0 0!important;padding-top:28px!important;border-top:1px solid rgba(13,27,42,.1)}
.paal:first-of-type{border-top:0;padding-top:0!important}
.tk .paal-h{margin:4px 0 16px!important;font:800 clamp(26px,4vw,34px)/1.2 'Inter Tight',Inter!important;color:#0d1b2a}.paal-h span{color:#64748b;font-weight:600}
.iyal{margin:22px 0 10px;display:flex;align-items:center;gap:12px;font:700 12px Inter;letter-spacing:.12em;text-transform:uppercase;color:#64748b}.iyal:after{content:"";flex:1;height:1px;background:rgba(13,27,42,.08)}.iyal b{color:#0d1b2a;letter-spacing:0;text-transform:none;font:650 15px 'Noto Sans Tamil',Inter}
.chg{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.chg a{display:grid;grid-template-columns:44px 1fr 18px;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;border:1px solid rgba(13,27,42,.07);background:#fff;color:#0d1b2a;text-decoration:none;transition:all .18s}
.chg a:hover{border-color:rgba(16,185,129,.4);transform:translateY(-1px);box-shadow:0 12px 26px -16px rgba(13,27,42,.25)}
.chg a i{font-style:normal;width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:#f1f5f9;color:#334155;font:800 15px 'Inter Tight',Inter}
.chg a:hover i{background:#ecfdf5;color:#047857}
.chg a b{display:block;font:650 15.5px/1.35 'Noto Sans Tamil',Inter}.chg a small{display:block;font:500 12.5px/1.4 Inter;color:#64748b;margin-top:2px}
.chg a em{font-style:normal;color:#cbd5e1;font-size:18px}.chg a:hover em{color:#10b981}
.pn{display:flex;justify-content:space-between;gap:10px;margin:24px 0}.pn a{flex:1;padding:12px 15px;border-radius:14px;border:1px solid rgba(13,27,42,.1);background:#fff;color:#0d1b2a;text-decoration:none;font:600 14px Inter}.pn a:last-child{text-align:right}
.tkq{margin:24px 0}
.tkq-s{font:600 13px Inter;color:#64748b;margin:0 0 6px}
.tkq-i{margin:0 0 10px}
.kq{display:block;font:650 16px/1.6 Inter;margin-top:6px;color:#0d1b2a}.kq.en{font:italic 400 15px/1.6 Inter;color:#334155}
.tkq-o{display:grid;gap:6px}
.tkq-o button{padding:10px 12px;border-radius:10px;border:1px solid transparent;background:#f7f9fa;color:#0d1b2a;font:500 14.5px/1.45 Inter;text-align:left;cursor:pointer}
.tkq-o button:hover{border-color:rgba(13,27,42,.15)}
.tkq-o button.ok{background:#ecfdf5;border-color:#10b981;color:#065f46}.tkq-o button.no{background:#fef2f2;border-color:#f87171;color:#991b1b}
.src{font:400 12px/1.6 Inter;color:#94a3b8;margin-top:26px}
</style>`;

function page({ url, title, desc, crumbs, body, extraLd = [] }) {
  body = body.replace(/^<h1>([\s\S]*?)<\/h1>(<p class="sub">[\s\S]*?<\/p>)(\n?<div class="meta">[\s\S]*?<\/div>)?/, (m, h, sub, meta) =>
    `<section class="topic-hero"><div class="eyebrow-chip"><span class="dot-pulse"></span>திருக்குறள் · Thirukkural</div><h1>${h}</h1>${sub.replace('class="sub"', '')}${meta || ''}</section>`);
  const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) };
  return `<!DOCTYPE html>
<html lang="ta">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${SITE + url}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="MindGains" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${SITE + url}" />
<meta property="og:image" content="${SITE}/assets/og-home.png" />
<meta name="twitter:card" content="summary_large_image" />
${HEADSTY}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@500;600&family=Noto+Sans+Tamil:wght@500;600&display=swap">
<script type="application/ld+json">${JSON.stringify(bc)}</script>
${extraLd.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
${CSS}
</head>
<body class="inner-v2">
${HEADER}
<main><nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${u}">${esc(n)}</a><span>›</span>`).join('')}</nav>
<div class="tk">
${body}
${BENTO}
<p class="src">குறள் மூலம்: பொதுக் களம் (public domain). தமிழ்ப் பொருள்: MindGains. English translation: Rev. G.U. Pope (1886), public domain.</p>
</div>
</main>
${FOOTER}
${QJS}
<script defer src="/assets/pv.js"></script>
<script defer src="/assets/nav-mobile.js"></script>
</body>
</html>
`;
}
const out = (rel, html) => { const p = path.join(ROOT, rel, 'index.html'); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
const pope = (t) => esc(t).replace(/([a-z,;:!?])(?=[A-Z])/g, '$1<br>').replace(/-(?=[A-Z])/g, ' – ');
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const kcard = (k, link, big) => `<${link ? `a href="/thirukkural/kural/${k.n}/"` : 'article'} class="kc${big ? ' kbig' : ''}"><div class="kn"><small>குறள்</small>${k.n}</div><div class="ta">“${esc(k.l1)}<br>${esc(k.l2)}”</div>${PORUL[k.n] ? `<div class="po"><span class="lbl">பொருள்</span>${esc(PORUL[k.n])}</div>` : ''}<div class="en"><span class="lbl">English · G.U. Pope</span>${pope(k.pope)}</div>${link ? `<span class="go">${ARROW}</span>` : ''}</${link ? 'a' : 'article'}>`;
const HUB = ['Home', '/'], TKH = ['திருக்குறள்', '/thirukkural/'];
const urls = ['/thirukkural/'];

// ---- hub
{
  const ccard = (c) => `<a href="/thirukkural/${c.n}/"><i>${c.n}</i><span><b>${esc(c.ta)}</b><small>${esc(c.en.replace(/"s/g, "'s"))}</small></span><em>›</em></a>`;
  const groups = [1, 2, 3].map((p) => { const cs = chapters.filter((c) => c.paal.n === p); const pp = cs[0].paal;
    const iy = [...new Set(cs.map((c) => c.iyal.ta))].map((name) => { const ic = cs.filter((c) => c.iyal.ta === name);
      return `<div class="iyal"><b>${esc(name)}</b> ${esc(ic[0].iyal.en)} · ${ic.length}</div><div class="chg">${ic.map(ccard).join('')}</div>`; }).join('');
    return `<section class="paal"><p class="mg-seo-kicker">பால் ${p} · அதிகாரம் ${cs[0].n}–${cs[cs.length - 1].n} · குறள் ${cs[0].s}–${cs[cs.length - 1].e}</p><h2 class="paal-h">${esc(pp.ta)} <span>${esc(pp.en)}</span></h2>${iy}</section>`; }).join('\n');
  seed = 7;
  const qs = [1, 100, 391, 423, 1].slice(0, 4).map((n, i) => [qChapter, qMeaning, qBlank, qChapter][i](K(n)));
  out('thirukkural', page({ url: '/thirukkural/', title: 'திருக்குறள் 1330 குறள்கள் பொருளுடன் & Quiz | Thirukkural All Kurals with Meaning | MindGains',
    desc: 'All 1330 Thirukkural kurals in 133 adhikarams with English meaning (G.U. Pope), transliteration and a free quiz for every chapter. Practice for TNPSC Tamil.',
    crumbs: [HUB, TKH],
    body: `<h1>திருக்குறள் · Thirukkural</h1><p class="sub">திருவள்ளுவர் இயற்றிய 1330 குறள்கள், 133 அதிகாரங்கள், மூன்று பால்கள். Every kural with transliteration and English translation, and a quiz for every adhikaram. Useful for TNPSC Group 1, 2 and 4 Tamil.</p>
<div class="meta"><span>1330 குறள்கள்</span><span>133 அதிகாரங்கள்</span><span>அறம் · பொருள் · இன்பம்</span><span>ஒவ்வொரு அதிகாரத்திற்கும் quiz</span></div>
${groups}`,
    extraLd: [{ '@context': 'https://schema.org', '@type': 'Book', name: 'திருக்குறள் (Thirukkural)', author: { '@type': 'Person', name: 'திருவள்ளுவர் (Thiruvalluvar)' }, inLanguage: 'ta', url: SITE + '/thirukkural/' }] }));
}

// ---- adhikaram pages
for (const c of chapters) {
  seed = 1000 + c.n;
  const ks = kurals.slice(c.s - 1, c.e);
  const makers = [qBlank, qChapter, qMeaning];
  const qs = ks.map((k, i) => (i % 3 === 1 ? (PORUL[k.n] ? qPorul : qMeaning) : i % 3 === 2 ? qBlank : (c.n % 2 ? qBlank : qMeaning))(k));
  const prev = chapters[c.n - 2], next = chapters[c.n];
  const url = `/thirukkural/${c.n}/`; urls.push(url);
  out(`thirukkural/${c.n}`, page({ url,
    title: `அதிகாரம் ${c.n}: ${c.ta} (${c.tr}) – திருக்குறள் ${c.s}–${c.e} பொருளுடன் & Quiz | MindGains`,
    desc: `Thirukkural adhikaram ${c.n}, ${c.ta} (${c.en}): kurals ${c.s}–${c.e} with transliteration, English meaning and a 10-question quiz. ${c.paal.ta}, ${c.iyal.ta}.`,
    crumbs: [HUB, TKH, [`அதிகாரம் ${c.n}`, url]],
    body: `<h1>அதிகாரம் ${c.n}: ${esc(c.ta)}</h1><p class="sub">${esc(c.en)} · ${esc(c.tr)} · குறள் ${c.s}–${c.e}</p>
<div class="meta"><span>${esc(c.paal.ta)} · ${esc(c.paal.en)}</span><span>${esc(c.iyal.ta)} · ${esc(c.iyal.en)}</span><span>10 குறள்கள்</span></div><a class="jump" href="#quiz">10-question quiz ↓</a>
<div class="ks-head"><h2>10 குறள்கள்</h2><span>குறள் ${c.s}–${c.e}</span></div>
${ks.map((k) => kcard(k, true)).join('\n')}
<div id="quiz"></div>
${quizHTML(qs, `அதிகாரம் ${c.n} Quiz · ${c.ta}`)}
<div class="pn">${prev ? `<a href="/thirukkural/${prev.n}/">‹ ${prev.n}. ${esc(prev.ta)}</a>` : '<span></span>'}${next ? `<a href="/thirukkural/${next.n}/">${next.n}. ${esc(next.ta)} ›</a>` : '<span></span>'}</div>` }));
}

// ---- kural pages
for (const k of kurals) {
  seed = 5000 + k.n;
  const c = chOf(k.n);
  const qs = PORUL[k.n] ? [qPorul(k), qBlank(k), qChapter(k), qMeaning(k)] : [qBlank(k), qChapter(k), qMeaning(k)];
  const url = `/thirukkural/kural/${k.n}/`; urls.push(url);
  const sib = kurals.slice(c.s - 1, c.e).filter((x) => x.n !== k.n);
  out(`thirukkural/kural/${k.n}`, page({ url,
    title: `திருக்குறள் ${k.n}: ${k.l1.replace(/[.,]$/, '')} – பொருள் & Quiz | Kural ${k.n} Meaning`,
    desc: PORUL[k.n] ? `திருக்குறள் ${k.n} பொருள்: ${PORUL[k.n]} ${c.ta} அதிகாரம். English meaning, transliteration & quiz.` : `Thirukkural ${k.n} (${c.ta}, adhikaram ${c.n}): ${k.l1} ${k.l2} Meaning in English by G.U. Pope, transliteration and a quick quiz.`,
    crumbs: [HUB, TKH, [`அதிகாரம் ${c.n}`, `/thirukkural/${c.n}/`], [`குறள் ${k.n}`, url]],
    body: `<h1>திருக்குறள் ${k.n}</h1><p class="sub">அதிகாரம் ${c.n}: <a href="/thirukkural/${c.n}/" style="color:#37e0ff">${esc(c.ta)}</a> (${esc(c.en)}) · ${esc(c.paal.ta)} · ${esc(c.iyal.ta)}</p>
${kcard(k, false, true)}
${quizHTML(qs, `குறள் ${k.n} Quiz`)}
<h2>இதே அதிகாரத்தின் மற்ற குறள்கள்</h2><div class="chg">${sib.map((x) => `<a href="/thirukkural/kural/${x.n}/"><small>குறள் ${x.n}</small><b>${esc(x.l1)}</b></a>`).join('')}</div>
<div class="pn">${k.n > 1 ? `<a href="/thirukkural/kural/${k.n - 1}/">‹ குறள் ${k.n - 1}</a>` : '<span></span>'}${k.n < 1330 ? `<a href="/thirukkural/kural/${k.n + 1}/">குறள் ${k.n + 1} ›</a>` : '<span></span>'}</div>`,
    extraLd: [{ '@context': 'https://schema.org', '@type': 'Quotation', text: k.l1 + ' ' + k.l2, inLanguage: 'ta', creator: { '@type': 'Person', name: 'திருவள்ளுவர்' }, isPartOf: { '@type': 'Book', name: 'திருக்குறள்' } }] }));
}

// ---- sitemap block
const smP = path.join(ROOT, 'sitemap.xml'); let sm = fs.readFileSync(smP, 'utf8');
sm = sm.replace(/\s*<!-- TK_START -->[\s\S]*?<!-- TK_END -->/, '');
sm = sm.replace('</urlset>', `  <!-- TK_START -->\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n  <!-- TK_END -->\n</urlset>`);
fs.writeFileSync(smP, sm);
console.log('pages', urls.length);
