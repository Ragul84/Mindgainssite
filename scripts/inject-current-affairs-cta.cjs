/**
 * Adds a "today's current affairs" block to the exam and content pages.
 *
 * A nav link is a route, not a discovery: people scroll a topic page and leave. The NationLap
 * CTA on these same pages works because it sits in the reading flow, so this follows that
 * pattern rather than relying on the header alone.
 *
 * It is placed ABOVE the NationLap block: both are "now go do something", and the daily page
 * is the one worth returning for tomorrow.
 *
 * Idempotent — re-running replaces the block instead of stacking copies.
 *
 *   node scripts/inject-current-affairs-cta.cjs          # write
 *   node scripts/inject-current-affairs-cta.cjs --dry    # report only
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['upsc', 'tnpsc', 'ssc', 'rrb', 'ncert', 'samacheer', 'quiz'];
const OPEN = '<!-- current-affairs-cta:start -->';
const CLOSE = '<!-- current-affairs-cta:end -->';

const BLOCK = `${OPEN}
<section class="ca-cta" style="margin:28px 0;padding:22px;border-radius:16px;border:1px solid rgba(13,27,42,.10);background:linear-gradient(135deg,#fdf6e8,#ffffff)">
  <p style="margin:0 0 6px;color:#8a4a0c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Every morning, 5am</p>
  <h2 style="margin:0 0 6px;font-size:20px;line-height:1.25">Today's current affairs</h2>
  <p style="margin:0 0 14px;color:#55667a;font-size:15px;line-height:1.6">The day's news that an exam could actually ask, each card with its source and the static fact behind it. Free, no sign-up.</p>
  <a href="/nationlap/?affairs=1" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:12px;background:#0b7a72;color:#fff;font-weight:600;text-decoration:none">Race today's affairs</a>
</section>
${CLOSE}`;

function processFile(file, dry) {
  let html = fs.readFileSync(file, 'utf8');
  if ((html.includes('class="hub-v2') || html.includes('class="inner-v2"'))) return 'skipped:hub';

  const existing = new RegExp(`${OPEN}[\\s\\S]*?${CLOSE}\\n?`, 'g');
  const had = existing.test(html);
  html = html.replace(existing, '');

  // Prefer sitting directly above the NationLap block so the two calls to action read as one
  // pair rather than being separated by the page's own footer content.
  const anchor = '<!-- nationlap-cta:start -->';
  if (html.includes(anchor)) {
    html = html.replace(anchor, `${BLOCK}\n${anchor}`);
  } else if (html.includes('</main>')) {
    html = html.replace('</main>', `${BLOCK}\n</main>`);
  } else {
    return 'skipped:no-anchor';
  }

  if (!dry) fs.writeFileSync(file, html, 'utf8');
  return had ? 'updated' : 'added';
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const dry = process.argv.includes('--dry');
const tally = {};
let n = 0;
for (const d of DIRS) {
  const abs = path.join(ROOT, d);
  if (!fs.existsSync(abs)) continue;
  for (const f of walk(abs)) {
    const r = processFile(f, dry);
    tally[r] = (tally[r] || 0) + 1;
    n++;
  }
}
console.log(dry ? '(dry run)' : '(written)', `${n} pages`, tally);
