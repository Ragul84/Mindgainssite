/**
 * Adds a NationLap call-to-action to every exam/content page.
 *
 * Why: the site has ~1,086 generated content pages that already rank for real exam queries and
 * already convert to the waitlist (the "app-bridge" section -> /waitlist.html -> /get/). But
 * NationLap appeared on ZERO of them. The game sat at /nationlap/ with no route in from the
 * pages people actually land on.
 *
 * This is a post-processor rather than a change to the four generators: it touches the built
 * HTML the same way scripts/inject_nav_footer.js does, so it can't corrupt page content, and it
 * is idempotent — re-running replaces the block instead of stacking copies.
 *
 *   node scripts/inject-nationlap-cta.cjs          # write
 *   node scripts/inject-nationlap-cta.cjs --dry    # report only
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['upsc', 'tnpsc', 'ssc', 'rrb', 'ncert', 'samacheer', 'quiz'];
const MARK_OPEN = '<!-- nationlap-cta:start -->';
const MARK_CLOSE = '<!-- nationlap-cta:end -->';

// Which NationLap subject a page belongs to, so the CTA names the thing they were just reading
// about rather than saying "play our game".
const SUBJECT_BY_HINT = [
  [/polity|constitution|governance|civics/i, 'Polity'],
  [/histor|freedom|ancient|medieval|modern-india/i, 'History'],
  [/geograph|climate|river|soil|mineral/i, 'Geography'],
  [/econom|budget|banking|fiscal|gst/i, 'Economy'],
  [/science|physics|chemistry|biolog/i, 'Science'],
  // Reasoning BEFORE Quant: paths like "csat-quant/logical-reasoning" contain both, and the
  // more specific topic is the one the page is actually about.
  [/reason|logical|verbal|analog|syllog|blood-relation|direction|coding/i, 'Reasoning'],
  [/maths|quant|aptitude|arithmetic|algebra|percent|mensuration|trigo/i, 'Quant'],
  [/current-affairs|current_affairs/i, 'Current Affairs'],
];

function subjectFor(relPath, title) {
  const hay = `${relPath} ${title || ''}`;
  for (const [re, subject] of SUBJECT_BY_HINT) if (re.test(hay)) return subject;
  return null;
}

function block(subject) {
  // "a Economy" / "a Economy lap" reads wrong — pick the article from the subject
  const article = /^[AEIOU]/i.test(subject || '') ? 'an' : 'a';
  const line = subject
    ? `Race ${article} ${subject} lap — read the topic, then answer at speed.`
    : 'Read a topic, race it, then answer at speed.';
  return `${MARK_OPEN}
<section class="nationlap-cta" style="margin:28px 0;padding:22px;border-radius:16px;border:1px solid rgba(13,27,42,.10);background:linear-gradient(135deg,#f3f8f8,#ffffff)">
  <h2 style="margin:0 0 6px;font-size:20px;line-height:1.25">Practise this the fun way</h2>
  <p style="margin:0 0 14px;color:#475569;font-size:15px;line-height:1.6">${line} Free, no sign-up needed.</p>
  <a href="/nationlap/" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:12px;background:#0b7a72;color:#fff;font-weight:600;text-decoration:none">Play NationLap</a>
</section>
${MARK_CLOSE}`;
}

function processFile(file, dry) {
  let html = fs.readFileSync(file, 'utf8');
  if ((html.includes('class="hub-v2') || html.includes('class="inner-v2"'))) return 'skipped:hub';
  if (!html.includes('</main>')) return 'skipped:no-main';

  // re-running should replace, never stack
  const existing = new RegExp(`${MARK_OPEN}[\\s\\S]*?${MARK_CLOSE}\\n?`, 'g');
  const had = existing.test(html);
  html = html.replace(existing, '');

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const cta = block(subjectFor(rel, title));

  // just inside </main>, after the page's own content and existing waitlist bridge
  html = html.replace('</main>', `${cta}\n</main>`);
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
