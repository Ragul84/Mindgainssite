// NationLap, Live Theatre, Cut-Off Run and Pro are app-only now (MindGains app, Google Play billing), so website pages
// must not link to them: a second (Razorpay) Pro on the website would conflict with the app's. The pages themselves stay
// online for the app's WebView. Run after any page generator (build-pyq, build-exam-hubs, unify-footer, ...):
//   node scripts/hide-app-links.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'nationlap', 'play', 'pro', 'art', 'scripts', 'worker', '.wrangler']);
const HREF = /href\s*=\s*["'](?:https:\/\/mindgains\.ai)?\/(?:nationlap|play\/theatre|play\/cutoff-run)(?:[\/?#"'])/i;
// an <a> (no nested <a>) whose href is app-only, plus a wrapping <li> if it held only that link
const A = /(<li\b[^>]*>\s*)?<a\b[^>]*>(?:(?!<a\b)[\s\S])*?<\/a>(\s*<\/li>)?/gi;
let files = 0, links = 0;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name) || d !== ROOT) { if (d === ROOT && SKIP.has(e.name)) continue; walk(path.join(d, e.name)); } continue; }
    if (!e.name.endsWith('.html')) continue;
    const f = path.join(d, e.name), s = fs.readFileSync(f, 'utf8');
    let n = 0;
    // whole promo blocks for the app-only products (homepage "Learn it by playing it" trio, exam-hub NationLap showcase)
    const s2 = s.replace(/<!-- (play-trio|nl-showcase):start -->[\s\S]*?<!-- \1:end -->\s*/g, () => { n++; return ''; });
    const out = s2.replace(A, (m, li, endLi) => {
      const open = m.slice((li || '').length).match(/^<a\b[^>]*>/i)[0];
      if (!HREF.test(open)) return m;
      n++;
      return (li && endLi) ? '' : (li || '') + (endLi || '');
    });
    if (n) { fs.writeFileSync(f, out); files++; links += n; }
  }
}
walk(ROOT);
console.log(`hide-app-links: removed ${links} links in ${files} pages`);
