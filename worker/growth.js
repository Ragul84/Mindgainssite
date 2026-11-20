import { GF_LIB, GF_FNS } from './growth-assets.js';

// ==== growth-fixes-20261121 (mindgains.ai) ====
// Shared by the preview proxy and the production Worker patch.
// 1) Live Theatre: receipt QR + 1080x1080 square (from receipt-delta), fair 30-minute wall, 1-friend invite copy.
// 2) SEO: breadcrumb position 2 -> /quiz/, internal links to redirecting/404 URLs -> final URLs,
//    sitemap without redirecting URLs, llms.txt NationLap link, 301s for dead routes.
// Every patch is anchor-checked: if an anchor moved, that page is served unchanged.
var GF = (() => {
  const MOVED = {
    "/play": "/nationlap/", "/play/": "/nationlap/",
    "/play/theatre/pricing": "/pro/", "/play/theatre/pricing/": "/pro/",
    "/editorial/archive": "/blog/", "/editorial/archive/": "/blog/"
  };
  // final destinations of the site's own _redirects (consolidations) so links skip the hop
  const CONSOL = {
    "/waitlist.html": "/get/", "/waitlist": "/get/",
    "/ssc/english/error-spotting/": "/ssc/english/grammar/", "/ssc/english/sentence-correction/": "/ssc/english/grammar/",
    "/ssc/english/fill-blanks/": "/ssc/english/grammar/", "/ssc/english/cloze-test/": "/ssc/english/grammar/",
    "/ssc/english/idioms-phrases/": "/ssc/english/vocabulary/", "/ssc/english/one-word/": "/ssc/english/vocabulary/",
    "/ssc/english/synonyms-antonyms/": "/ssc/english/vocabulary/",
    "/upsc/csat-english/comprehension/": "/upsc/csat-english/", "/upsc/csat-english/logical-deduction/": "/upsc/csat-english/"
  };
  function finalPath(p) {
    let q = p, n = 0;
    while (n++ < 5) {
      let next = null;
      const m = /^\/quiz\/(upsc|tnpsc|ssc|rrb|ncert|samacheer)(\/.*)?$/.exec(q);
      if (m) next = "/" + m[1] + (m[2] || "/");
      else if (MOVED[q]) next = MOVED[q];
      else if (CONSOL[q]) next = CONSOL[q];
      else if (!q.endsWith("/") && !/\.[a-z0-9]+$/i.test(q) && CONSOL[q + "/"]) next = CONSOL[q + "/"];
      if (!next || next === q) break;
      q = next;
    }
    return q;
  }
  // only touch markup outside <script>/<style>
  function outsideScripts(html, fn) {
    return html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i).map((part, i) => i % 2 ? part : fn(part)).join("");
  }
  function fixHrefs(html) {
    let n = 0;
    const out = outsideScripts(html, (s) => s.replace(/(<a\b[^>]*?\shref=)(["'])(https:\/\/mindgains\.ai)?(\/[^"'#?\s]*)([^"']*)\2/gi, (all, pre, qt, abs, path, rest) => {
      const f = finalPath(path);
      if (f === path) return all;
      n++;
      return pre + qt + (abs || "") + f + rest + qt;
    }));
    return { html: out, n };
  }
  const BC_RE = /("position"\s*:\s*2\s*,\s*"name"\s*:\s*)"Quiz"(\s*,\s*"item"\s*:\s*)"https:\/\/mindgains\.ai\/?"/g;
  function fixBreadcrumb(html) {
    let n = 0;
    const out = html.replace(BC_RE, (a, p1, p2) => { n++; return p1 + '"Quiz Hub"' + p2 + '"https://mindgains.ai/quiz/"'; });
    return { html: out, n };
  }
  function patchSitemap(xml) {
    const seen = new Set(); let changed = 0, dropped = 0;
    const out = xml.replace(/<url>([\s\S]*?)<\/url>\s*/g, (blk, inner) => {
      const m = /<loc>\s*https:\/\/mindgains\.ai(\/[^<\s]*)\s*<\/loc>/.exec(inner);
      if (!m) return blk;
      const f = finalPath(m[1]);
      if (seen.has(f)) { dropped++; return ""; }
      seen.add(f);
      if (f !== m[1]) { changed++; return blk.replace(m[0], "<loc>https://mindgains.ai" + f + "</loc>"); }
      return blk;
    });
    return { text: out, changed, dropped };
  }
  function patchLlms(txt) { return txt.replace(/\(https:\/\/mindgains\.ai\/play\/\)/g, "(https://mindgains.ai/nationlap/)"); }
  function patchPro(html) {
    return html.replace("When 5 new friends sign in through your link, you get 3 days of Pro, and each friend gets",
      "When a new friend signs in through your link and answers 3 live quizzes, you get 3 days of Pro, and each friend gets");
  }

  // ---------- Live Theatre ----------
  const FONT_OLD = "family=Inter:wght@500;600;700&display=swap";
  const FONT_NEW = "family=Inter:wght@500;600;700;800&display=swap";
  const RC_START = "async function makeReceipt() {";
  const RC_END = "window.__receipt = { make: makeReceipt, share: shareReceipt, RC };";
  const WALL_START = "function showWall(kind) {";
  const WALL_END = "function hideWall() {";
  const WALL_NEW = String.raw`function showWall(kind) {
  if (kind === 'signin') return showGate();
  const g = document.getElementById('wall'); if (g && g.dataset.kind === 'signin') g.remove();
  if ((window.__walled && document.getElementById('wall')) || PRO) return;
  // fair finish: a live question already on screen runs to its reveal before the wall shows
  const lq = live.quiz, wait = lq && lq.ends ? lq.ends + 6500 - Date.now() : 0;
  if (wait > 0 && wait < 30000) {
    if (!window.__wallSoon) { window.__wallSoon = setTimeout(() => { window.__wallSoon = 0; showWall(kind); }, wait); try { flashCard('Free time is up · finish this question first'); } catch (e) {} }
    return;
  }
  window.__walled = true;
  try { const vb = document.querySelector('.vback'); if (vb && vb.offsetParent) vb.click(); } catch (e) {}
  try { playOnScreen('', 0); } catch (e) {}
  const back = encodeURIComponent(location.pathname + location.search), n = Math.max(1, (live.n || 1) - 1);
  let S = {}; try { S = RC || {}; } catch (e) {}
  const mins = Math.max(30, Math.round((S.secs || 0) / 60)), qa = S.q || 0, ok = S.right || 0;
  const stat = (v, l) => '<div style="flex:1;min-width:0;padding:10px 6px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(243,200,107,.22)"><b style="display:block;font:400 26px/1 \'Bebas Neue\';color:#ffe2a0;letter-spacing:.02em">' + v + '</b><span style="font:600 11px Inter;color:#a49d92">' + l + '</span></div>';
  const st = stat(mins >= 60 ? Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm' : mins + ' min', 'watched today') + stat(qa ? ok + '/' + qa : '0', 'quiz answers right') + (S.rank ? stat('#' + S.rank + (S.of ? '<small style="font-size:14px;color:#a49d92"> of ' + S.of + '</small>' : ''), 'tonight\'s rank') : '');
  const d = document.createElement('div'); d.className = 'wall'; d.id = 'wall'; d.dataset.kind = 'free';
  d.innerHTML = '<div class="wc"><span class="wk"><i></i>' + n + ' STILL IN THE HALL</span>' +
    '<h2>Your free 30 minutes are up<em>nice work today.</em></h2>' +
    '<div id="wallStats" style="display:flex;gap:8px;margin:0 0 14px;text-align:center">' + st + '</div>' +
    '<p>The class keeps running. Your free time comes back in <b>' + untilMidnightIST() + '</b>, or stay on with Pro: <b>unlimited</b> theatre, your <b>weak chapters</b>, and a streak that never dies.</p>' +
    '<a class="wb wb1" href="/pro/?plan=month&back=' + back + '" id="wallM">Pro Monthly · ₹99<small>30 days of Pro</small></a>' +
    '<a class="wb wb2" href="/pro/?plan=exam&back=' + back + '" id="wallE">Exam Pass · ₹399<small style="display:block;font:600 12px Inter;opacity:.7;margin-top:2px">6 months · about ₹66 a month</small></a>' +
    (signedIn ? '' : '<button class="wb wb2" id="wallS">Already Pro? Sign in</button>') +
    '<div class="wt" style="margin-top:4px;color:#b9b1a4">One-time payment · no auto-debit · 7-day refund</div>' +
    '<button class="wb wb2" id="wallInv" type="button">Or invite 1 friend · get 3 days Pro free<small style="display:block;font:600 12px Inter;opacity:.7;margin-top:2px">unlocks when they answer 3 live quizzes</small></button>' +
    '<div class="wt"><a href="/nationlap/">Race NationLap instead</a></div></div>';
  document.body.appendChild(d);
  fetch('/api/pro/me').then((r) => r.json()).then((x) => { if (x && x.launch) { const a = document.getElementById('wallM'); if (a) a.innerHTML = 'First month of Pro · ₹49<small>launch offer · 30 days · renewing later is ₹99</small>'; } }).catch(() => {});
  const sb = document.getElementById('wallS'); if (sb) sb.onclick = () => account.signInPopup();
  const wi = document.getElementById('wallInv'); if (wi) wi.onclick = () => document.getElementById('inv').click();
}
`;
  const SWAPS = [
    ['id="invB">5 friends = 3 days Pro<', 'id="invB">1 friend = 3 days Pro<'],
    ["invite 5 friends yourself for 3 days of Pro'", "invite 1 friend yourself: when they answer 3 live quizzes you get 3 days of Pro'"],
    ["`Invite link copied · ${R.pending}/${R.need} friends joined · 5 new friends = 3 days Pro`", "`Invite link copied · ${R.pending ? R.pending + ' joined, waiting for their 3 quizzes · ' : ''}1 friend who answers 3 live quizzes = 3 days Pro`"],
    ["b.textContent = R.pending + '/' + R.need + ' friends · 3 days Pro';", "b.textContent = R.pending ? R.pending + ' joined · 3 quizzes unlocks Pro' : '1 friend = 3 days Pro';"]
  ];
  function stripCf(html) { return html.replace(/<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>/g, ""); }
  function patchTheatre(html, LIB, FNS) {
    if (html.includes("growth-fixes-20261121")) return { ok: true, html, already: true };
    const miss = [RC_START, RC_END, WALL_START, WALL_END, '<script type="module">'].filter((a) => !html.includes(a));
    for (const [a] of SWAPS) if (!html.includes(a)) miss.push(a.slice(0, 40));
    if (miss.length) return { ok: false, reason: "anchors moved: " + miss.join(" | ") };
    if (html.includes(FONT_OLD)) html = html.replace(FONT_OLD, FONT_NEW);
    if (!html.includes("Kazuhiko Arase")) html = html.replace('<script type="module">', "<script>\n" + LIB + "</script>\n<script type=\"module\">");
    let i = html.indexOf(RC_START), j = html.indexOf(RC_END);
    html = html.slice(0, i) + FNS + html.slice(j + RC_END.length);
    i = html.indexOf(WALL_START); j = html.indexOf(WALL_END, i);
    if (i < 0 || j < i) return { ok: false, reason: "wall anchors moved" };
    html = html.slice(0, i) + WALL_NEW + html.slice(j);
    for (const [a, b] of SWAPS) html = html.split(a).join(b);
    html = html.replace("</head>", "<meta name=\"mg-patch\" content=\"growth-fixes-20261121\">\n</head>");
    return { ok: true, html };
  }
  const SEO_PREFIX = /^\/(tnpsc|samacheer|upsc|ncert|ssc|rrb|blog|editorial|daily-dose|know-your-india|misa|quiz|study-lab)(\/|$)/;
  function kind(path, ctype) {
    if (path === "/play/theatre/" || path === "/play/theatre/index.html") return "theatre";
    if (path === "/sitemap.xml") return "sitemap";
    if (path === "/llms.txt") return "llms";
    if (!/text\/html/i.test(ctype || "")) return null;
    if (path === "/pro/" || path === "/pro/index.html") return "pro";
    if (SEO_PREFIX.test(path)) return "seo";
    return null;
  }
  // returns { body, tag } ; body === null means serve the original unchanged
  function apply(k, path, text, LIB, FNS) {
    if (k === "theatre") { const p = patchTheatre(stripCf(text), LIB, FNS); return p.ok ? { body: p.html, tag: "theatre" } : { body: null, tag: "theatre-skip: " + p.reason }; }
    if (k === "sitemap") { const s = patchSitemap(text); return { body: s.text, tag: `sitemap ${s.changed}c ${s.dropped}d` }; }
    if (k === "llms") return { body: patchLlms(text), tag: "llms" };
    if (k === "pro") return { body: patchPro(text), tag: "pro" };
    if (k === "seo") { const b = fixBreadcrumb(text), h = fixHrefs(b.html); return { body: h.html, tag: `seo bc${b.n} href${h.n}` }; }
    return { body: null, tag: "none" };
  }
  return { MOVED, finalPath, fixHrefs, fixBreadcrumb, patchSitemap, patchLlms, patchPro, patchTheatre, stripCf, kind, apply, moved: (p) => MOVED[p] || null };
})();

// growth-fixes-20261121: serve assets through the Worker for the patched paths only
async function growthServe(request, env) {
  const url = new URL(request.url);
  const m = request.method;
  if (m === "GET" || m === "HEAD") {
    const to = GF.moved(url.pathname);
    if (to) return Response.redirect(url.origin + to + url.search, 301);
  }
  const res = await env.ASSETS.fetch(request);
  if (m !== "GET" || res.status !== 200) return res;
  const k = GF.kind(url.pathname, res.headers.get("content-type") || "");
  if (!k) return res;
  let text;
  try { text = await res.clone().text(); } catch { return res; }
  let r;
  try { r = GF.apply(k, url.pathname, text, GF_LIB, GF_FNS); } catch (e) { r = { body: null, tag: "error" }; }
  if (r.body == null || r.body === text) return res;
  const h = new Headers(res.headers);
  h.delete("content-length"); h.delete("etag"); h.delete("content-encoding");
  h.set("x-mg-gf", r.tag.slice(0, 80));
  return new Response(r.body, { status: 200, headers: h });
}

export { GF, growthServe };
