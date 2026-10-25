/**
 * Puts the pageview script on every page of the site.
 *
 * The site had no analytics at all, so there was no way to tell which of ~708 indexed URLs earn
 * traffic, or whether anyone reaches NationLap or the waitlist from them.
 *
 * Idempotent: re-running replaces the tag rather than adding another.
 *
 *   node scripts/inject-analytics.cjs         # write
 *   node scripts/inject-analytics.cjs --dry   # report only
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TAG = '<script defer src="/assets/pv.js"></script>';
const RE = /\s*<script[^>]*src="\/assets\/pv\.js"[^>]*><\/script>/g;

// everything the site serves, minus build tooling and anything .assetsignore already excludes
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', 'scripts', '.cp-images', 'assets']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html') && e.name !== 'home-legacy.html') {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const dry = process.argv.includes('--dry');
const tally = {};
for (const f of walk(ROOT)) {
  let html = fs.readFileSync(f, 'utf8');
  if (!html.includes('</body>')) { tally['skipped:no-body'] = (tally['skipped:no-body'] || 0) + 1; continue; }
  const had = RE.test(html);
  RE.lastIndex = 0;
  html = html.replace(RE, '');
  html = html.replace('</body>', `${TAG}\n</body>`);
  if (!dry) fs.writeFileSync(f, html, 'utf8');
  const k = had ? 'updated' : 'added';
  tally[k] = (tally[k] || 0) + 1;
}
console.log(dry ? '(dry run)' : '(written)', tally);
