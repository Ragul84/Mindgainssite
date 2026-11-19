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
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
function quizHTML(qs, title) {
  return `<section class="tkq" aria-label="${esc(title)}"><h2>${esc(title)}</h2><p class="tkq-s"><b class="tkq-sc">0</b> / ${qs.length} சரி</p>
${qs.map((x, i) => `<div class="tkq-i"><p class="tkq-q"><b>${i + 1}.</b> ${x.q}</p><div class="tkq-o">${x.opts.map((o) => `<button type="button"${o === x.a ? ' data-c="1"' : ''}>${esc(o)}</button>`).join('')}</div></div>`).join('\n')}
</section>`;
}
const QJS = `<script>document.querySelectorAll('.tkq').forEach(function(s){var sc=s.querySelector('.tkq-sc'),n=0;s.querySelectorAll('.tkq-i').forEach(function(it){it.querySelectorAll('button').forEach(function(b){b.onclick=function(){if(it.dataset.d)return;it.dataset.d=1;var ok=b.dataset.c;b.classList.add(ok?'ok':'no');if(!ok){var c=it.querySelector('[data-c]');c&&c.classList.add('ok')}else{sc.textContent=++n}}})})})</script>`;

const CSS = `<style>
.tk{max-width:860px;margin:0 auto;padding:0 16px 40px}
.tk h1{font:400 clamp(30px,6vw,46px)/1.1 'Instrument Serif',serif;margin:18px 0 8px}
.tk .sub{color:rgba(255,255,255,.7);font:500 15px/1.6 Inter,sans-serif;margin:0 0 18px}
.tk .meta{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}.tk .meta span{font:600 12px Inter;padding:6px 12px;border-radius:99px;border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.8)}
.kc{display:block;padding:18px 20px;margin:0 0 12px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);text-decoration:none;color:inherit}
a.kc:hover{border-color:rgba(55,224,255,.5)}
.kc .kn{font:700 12px Inter;letter-spacing:.08em;color:#37e0ff}.kc .ta{font:600 19px/1.7 'Noto Sans Tamil',Inter,sans-serif;margin:6px 0}
.kc .tr{font:italic 400 14px/1.5 Inter;color:rgba(255,255,255,.55);margin:0 0 6px}.kc .en{font:400 15px/1.55 Inter;color:rgba(255,255,255,.82)}
.kbig .ta{font-size:clamp(22px,4.6vw,28px)}
.tk h2{font:600 20px Inter;margin:28px 0 12px}
.chg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.chg a{display:block;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:inherit;text-decoration:none;font:500 14px/1.4 Inter}
.chg a b{display:block;font:600 15px 'Noto Sans Tamil',Inter}.chg a small{color:rgba(255,255,255,.55)}
.pn{display:flex;justify-content:space-between;gap:10px;margin:26px 0}.pn a{flex:1;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.12);color:inherit;text-decoration:none;font:600 14px Inter}.pn a:last-child{text-align:right}
.tkq{margin:28px 0;padding:20px;border-radius:20px;border:1px solid rgba(55,224,255,.25);background:rgba(55,224,255,.04)}
.tkq h2{margin:0 0 4px}.tkq-s{font:600 13px Inter;color:rgba(255,255,255,.6);margin:0 0 14px}
.tkq-i{padding:14px 0;border-top:1px solid rgba(255,255,255,.08)}.tkq-q{font:500 15px/1.6 Inter;margin:0 0 10px}
.kq{display:block;font:600 16px/1.7 'Noto Sans Tamil',Inter;margin-top:6px;color:#fff}.kq.en{font:italic 400 15px/1.6 Inter}
.tkq-o{display:grid;grid-template-columns:1fr 1fr;gap:8px}@media(max-width:560px){.tkq-o{grid-template-columns:1fr}}
.tkq-o button{padding:11px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#fff;font:500 14px/1.4 'Noto Sans Tamil',Inter;text-align:left;cursor:pointer}
.tkq-o button.ok{background:rgba(52,211,153,.18);border-color:#34d399}.tkq-o button.no{background:rgba(248,113,113,.16);border-color:#f87171}
.cta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin:30px 0;padding:18px 20px;border-radius:18px;background:linear-gradient(90deg,rgba(243,200,107,.14),rgba(55,224,255,.08));border:1px solid rgba(243,200,107,.3)}
.cta p{margin:0;font:500 15px/1.5 Inter}.cta a{padding:11px 18px;border-radius:12px;background:#f3c86b;color:#1a1206;font:700 14px Inter;text-decoration:none}
.src{font:400 12px/1.6 Inter;color:rgba(255,255,255,.45);margin-top:30px}
</style>`;

function page({ url, title, desc, crumbs, body, extraLd = [] }) {
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
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/quiz-hub.css?v=20261002_mobilenav" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#37e0ff" />
<script type="application/ld+json">${JSON.stringify(bc)}</script>
${extraLd.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
${CSS}
</head>
<body class="inner-v2">
${HEADER}
<main><nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<span>${esc(n)}</span>` : `<a href="${u}">${esc(n)}</a><span>›</span>`).join('')}</nav>
<div class="tk">
${body}
<div class="cta"><p><b>Race your friends on Thirukkural.</b> Answer live against aspirants across India in NationLap.</p><a href="/nationlap/">Play NationLap</a></div>
<p class="src">குறள் மூலம்: பொதுக் களம் (public domain). English translation: Rev. G.U. Pope (1886), public domain.</p>
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
const kcard = (k, link, big) => `<${link ? `a href="/thirukkural/kural/${k.n}/"` : 'div'} class="kc${big ? ' kbig' : ''}"><div class="kn">குறள் ${k.n}</div><div class="ta">${esc(k.l1)}<br>${esc(k.l2)}</div><p class="tr">${esc(k.t1)} / ${esc(k.t2)}</p><div class="en">${esc(k.pope)}</div></${link ? 'a' : 'div'}>`;
const HUB = ['Home', '/'], TKH = ['திருக்குறள்', '/thirukkural/'];
const urls = ['/thirukkural/'];

// ---- hub
{
  const groups = [1, 2, 3].map((p) => { const cs = chapters.filter((c) => c.paal.n === p); const pp = cs[0].paal;
    return `<h2>${esc(pp.ta)} · ${esc(pp.en)} <small style="font-weight:400;color:rgba(255,255,255,.5)">(அதிகாரம் ${cs[0].n}–${cs[cs.length - 1].n})</small></h2><div class="chg">${cs.map((c) => `<a href="/thirukkural/${c.n}/"><small>அதிகாரம் ${c.n}</small><b>${esc(c.ta)}</b><small>${esc(c.en)}</small></a>`).join('')}</div>`; }).join('\n');
  seed = 7;
  const qs = [1, 100, 391, 423, 1].slice(0, 4).map((n, i) => [qChapter, qMeaning, qBlank, qChapter][i](K(n)));
  out('thirukkural', page({ url: '/thirukkural/', title: 'திருக்குறள் 1330 குறள்கள் பொருளுடன் & Quiz | Thirukkural All Kurals with Meaning | MindGains',
    desc: 'All 1330 Thirukkural kurals in 133 adhikarams with English meaning (G.U. Pope), transliteration and a free quiz for every chapter. Practice for TNPSC Tamil.',
    crumbs: [HUB, TKH],
    body: `<h1>திருக்குறள் · Thirukkural</h1><p class="sub">திருவள்ளுவர் இயற்றிய 1330 குறள்கள், 133 அதிகாரங்கள், மூன்று பால்கள். Every kural with transliteration and English translation, and a quiz for every adhikaram. Useful for TNPSC Group 1, 2 and 4 Tamil.</p>
<div class="meta"><span>1330 குறள்கள்</span><span>133 அதிகாரங்கள்</span><span>அறம் · பொருள் · இன்பம்</span><span>Free quiz</span></div>
${quizHTML(qs, 'Quick Thirukkural quiz')}
${groups}`,
    extraLd: [{ '@context': 'https://schema.org', '@type': 'Book', name: 'திருக்குறள் (Thirukkural)', author: { '@type': 'Person', name: 'திருவள்ளுவர் (Thiruvalluvar)' }, inLanguage: 'ta', url: SITE + '/thirukkural/' }] }));
}

// ---- adhikaram pages
for (const c of chapters) {
  seed = 1000 + c.n;
  const ks = kurals.slice(c.s - 1, c.e);
  const makers = [qBlank, qChapter, qMeaning];
  const qs = ks.map((k, i) => (i % 3 === 1 ? qMeaning : i % 3 === 2 ? qBlank : (c.n % 2 ? qBlank : qMeaning))(k));
  const prev = chapters[c.n - 2], next = chapters[c.n];
  const url = `/thirukkural/${c.n}/`; urls.push(url);
  out(`thirukkural/${c.n}`, page({ url,
    title: `அதிகாரம் ${c.n}: ${c.ta} (${c.tr}) – திருக்குறள் ${c.s}–${c.e} பொருளுடன் & Quiz | MindGains`,
    desc: `Thirukkural adhikaram ${c.n}, ${c.ta} (${c.en}): kurals ${c.s}–${c.e} with transliteration, English meaning and a 10-question quiz. ${c.paal.ta}, ${c.iyal.ta}.`,
    crumbs: [HUB, TKH, [`அதிகாரம் ${c.n}`, url]],
    body: `<h1>அதிகாரம் ${c.n}: ${esc(c.ta)}</h1><p class="sub">${esc(c.en)} · ${esc(c.tr)} · குறள் ${c.s}–${c.e}</p>
<div class="meta"><span>${esc(c.paal.ta)} · ${esc(c.paal.en)}</span><span>${esc(c.iyal.ta)} · ${esc(c.iyal.en)}</span><span>10 குறள்கள்</span></div>
${ks.map((k) => kcard(k, true)).join('\n')}
${quizHTML(qs, `அதிகாரம் ${c.n} Quiz · ${c.ta}`)}
<div class="pn">${prev ? `<a href="/thirukkural/${prev.n}/">‹ ${prev.n}. ${esc(prev.ta)}</a>` : '<span></span>'}${next ? `<a href="/thirukkural/${next.n}/">${next.n}. ${esc(next.ta)} ›</a>` : '<span></span>'}</div>` }));
}

// ---- kural pages
for (const k of kurals) {
  seed = 5000 + k.n;
  const c = chOf(k.n);
  const qs = [qBlank(k), qChapter(k), qMeaning(k)];
  const url = `/thirukkural/kural/${k.n}/`; urls.push(url);
  const sib = kurals.slice(c.s - 1, c.e).filter((x) => x.n !== k.n);
  out(`thirukkural/kural/${k.n}`, page({ url,
    title: `திருக்குறள் ${k.n}: ${k.l1.replace(/[.,]$/, '')} – பொருள் & Quiz | Kural ${k.n} Meaning`,
    desc: `Thirukkural ${k.n} (${c.ta}, adhikaram ${c.n}): ${k.l1} ${k.l2} Meaning in English by G.U. Pope, transliteration and a quick quiz.`,
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
