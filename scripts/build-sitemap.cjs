/**
 * Rebuilds sitemap.xml from what is actually on disk.
 *
 * Why: the committed sitemap listed 708 URLs while the site had 1,109 pages. Everything
 * under /quiz/ (383 pages), the whole blog and editorial section, /nationlap/, /daily-dose/
 * and /current-affairs/ were absent, so Google was never told they exist. It also carried no
 * <lastmod> at all, which leaves crawlers no freshness signal on a site whose whole pitch is
 * daily material.
 *
 *   node scripts/build-sitemap.cjs          # write
 *   node scripts/build-sitemap.cjs --dry    # report only
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://mindgains.ai';
const DRY = process.argv.includes('--dry');

// Directories that hold assets or tooling rather than pages.
const SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', 'scripts', 'assets', '.cp-images', 'content']);

// Pages that must never be advertised to search: utility routes, dead legacy copies, and
// anything that only makes sense mid-flow.
const EXCLUDE = new Set(['/auth', '/home-legacy.html', '/chat', '/waitlist.html']);

// Rough priority by section. Hubs outrank leaves; the daily page outranks everything because
// it is the only URL whose content changes every morning.
function weightFor(url) {
  if (url === '/') return { p: '1.0', f: 'daily' };
  if (url === '/current-affairs') return { p: '0.9', f: 'daily' };
  if (url === '/nationlap' || url === '/quiz') return { p: '0.8', f: 'weekly' };
  if (/^\/(upsc|tnpsc|ssc|rrb|ncert|samacheer)$/.test(url)) return { p: '0.8', f: 'weekly' };
  if (/\/mcq-questions$/.test(url)) return { p: '0.6', f: 'monthly' };
  if (/^\/(blog|editorial)/.test(url)) return { p: '0.6', f: 'monthly' };
  const depth = url.split('/').filter(Boolean).length;
  return { p: depth <= 2 ? '0.7' : '0.6', f: 'monthly' };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const seen = new Map();
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');

  // Respect the page's own wishes before anything else.
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;

  let url = '/' + path.relative(ROOT, file).split(path.sep).join('/');
  url = url.replace(/\/index\.html$/, '');
  if (url === '') url = '/';
  if (EXCLUDE.has(url)) continue;

  // A canonical pointing elsewhere means this URL is not the one to index.
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1];
  if (canon) {
    const c = canon.replace(ORIGIN, '').replace(/\/$/, '') || '/';
    if (c !== url) continue;
  }

  const stat = fs.statSync(file);
  seen.set(url, stat.mtime.toISOString().slice(0, 10));
}

const urls = [...seen.entries()].sort(([a], [b]) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const body = urls
  .map(([url, lastmod]) => {
    const { p, f } = weightFor(url);
    const loc = ORIGIN + (url === '/' ? '/' : url + '/');
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${f}</changefreq>\n    <priority>${p}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.w3.org/1999/sitemap-image/1.1 https://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  .replace('http://www.w3.org/1999/sitemap-image/1.1 https://www.sitemaps.org/schemas/sitemap/0.9', 'http://www.sitemaps.org/schemas/sitemap/0.9');

if (!DRY) fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');

const bySection = {};
for (const [u] of urls) {
  const k = u.split('/').filter(Boolean)[0] || '(root)';
  bySection[k] = (bySection[k] || 0) + 1;
}
console.log(DRY ? '(dry run)' : '(written)', `${urls.length} URLs`);
console.log(bySection);
