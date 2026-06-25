#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const SITE_URL = (process.env.BASE_URL || process.env.SITE_URL || 'https://mindgains.ai').replace(/\/$/, '');

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attr(value) {
  return htmlEscape(value).replace(/\n/g, ' ');
}

function canonical(pathname) {
  return SITE_URL + pathname;
}

function iconMeta() {
  return `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#37e0ff" />`;
}

function parsePost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${filePath}`);
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  if (!meta.title || !meta.slug || !meta.description || !meta.publishedDate || !meta.heroImage) {
    throw new Error(`Missing required metadata: ${filePath}`);
  }
  return {
    ...meta,
    author: meta.author || 'MindGains Team',
    readingTime: meta.readingTime || estimateReadingTime(match[2]),
    relatedQuizzes: (meta.relatedQuizzes || '').split('|').map((x) => x.trim()).filter(Boolean),
    body: match[2].trim(),
  };
}

function estimateReadingTime(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function inlineMarkdown(text) {
  return htmlEscape(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let paragraph = [];
  let list = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    out.push(`<ol>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ol>`);
    list = [];
  }

  for (const line of lines) {
    const text = line.trim();
    if (!text) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = text.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const ordered = text.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      list.push(ordered[1]);
      continue;
    }
    paragraph.push(text);
  }
  flushParagraph();
  flushList();
  return out.join('\n');
}

function relatedTitle(url) {
  const parts = url.replace(/\/$/, '').split('/');
  const slug = parts[parts.length - 1] || 'quiz';
  const exam = (parts[3] || '').toUpperCase();
  return `${exam} ${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Quiz`;
}

function pageShell({ title, description, pathname, image, body, schema }) {
  const url = canonical(pathname);
  const absoluteImage = image.startsWith('http') ? image : SITE_URL + image;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${htmlEscape(title)}</title>
<meta name="description" content="${attr(description)}" />
<link rel="canonical" href="${attr(url)}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${attr(title)}" />
<meta property="og:description" content="${attr(description)}" />
<meta property="og:url" content="${attr(url)}" />
<meta property="og:image" content="${attr(absoluteImage)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(title)}" />
<meta name="twitter:description" content="${attr(description)}" />
<meta name="twitter:image" content="${attr(absoluteImage)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/blog.css" />
${iconMeta()}
${schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n')}
</head>
<body>
<div class="bg"></div>
<header class="site-nav">
  <a class="brand" href="/"><span></span>MindGains</a>
  <nav><a href="/blog/">Blog</a><a href="/quiz/">Quiz Hub</a><a href="/#join">Waitlist</a></nav>
</header>
<main>${body}</main>
</body>
</html>`;
}

function blogCss() {
  return `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.18),transparent 34%),radial-gradient(circle at 10% 10%,rgba(125,108,255,.13),transparent 32%),linear-gradient(180deg,#05060a,#08111c 56%,#030407)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.72);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:10px;font-weight:700}.brand span{width:10px;height:10px;border-radius:99px;background:linear-gradient(135deg,#37e0ff,#7d6cff);box-shadow:0 0 22px #37e0ff}.site-nav nav{display:flex;gap:18px;color:#cbd5e1;font-size:14px}main{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:28px 0 64px}.blog-hero{padding:34px 0 22px}.eyebrow{margin:0 0 10px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:700}.blog-hero h1{max-width:980px;font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(42px,7vw,82px);line-height:.95;margin:0;letter-spacing:0;font-weight:400}.dek{max-width:760px;color:rgba(248,251,255,.76);font-size:clamp(16px,1.8vw,20px);line-height:1.55;margin:16px 0 0}.meta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;color:#cbd5e1;font-size:14px}.meta-row span{padding:9px 12px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(255,255,255,.055)}.hero-image{margin:20px 0 30px;border-radius:26px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}.hero-image img{display:block;width:100%;height:auto}.article-wrap{display:grid;grid-template-columns:minmax(0,760px) minmax(240px,1fr);gap:36px;align-items:start}.article{padding:4px 0}.article p,.article li{color:#d7e2f2;font-size:18px;line-height:1.78}.article p{margin:0 0 22px}.article h2{font-size:clamp(30px,4vw,46px);line-height:1.05;margin:44px 0 14px;font-family:"Instrument Serif",serif;font-weight:400;font-style:italic}.article h3{font-size:22px;line-height:1.25;margin:28px 0 10px}.article ol{padding-left:24px;margin:0 0 24px}.article a{color:#67e8f9}.side{position:sticky;top:84px;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:18px;background:rgba(255,255,255,.055)}.side h2{font-size:18px;margin:0 0 10px}.side p{color:#aebbd0;line-height:1.55;margin:0 0 14px}.side a{display:inline-flex;padding:12px 14px;border-radius:14px;background:#37e0ff;color:#001014;font-weight:800}.related,.cta,.post-nav,.blog-list{margin-top:34px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));padding:22px}.related h2,.cta h2,.blog-list h2{font-size:30px;margin:0 0 14px}.quiz-links{display:grid;gap:10px}.quiz-links a{padding:15px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);color:#e8fbff}.cta p{max-width:720px;color:#d7e2f2;line-height:1.6}.cta ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;color:#dffbff;padding-left:20px}.button{display:inline-flex;margin-top:12px;padding:14px 18px;border-radius:16px;background:#37e0ff;color:#001014;font-weight:800}.post-nav{display:grid;grid-template-columns:1fr 1fr;gap:12px}.post-nav div{min-height:64px;padding:14px;border-radius:16px;background:rgba(255,255,255,.055);color:#91a4bd}.post-nav a{color:#e8fbff;font-weight:700}.blog-card{display:block;padding:18px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1)}.blog-card h2{font-size:26px;margin:0 0 8px}.blog-card p{color:#b8c4d6;line-height:1.55;margin:0 0 12px}.breadcrumbs{display:flex;gap:8px;flex-wrap:wrap;color:#91a4bd;font-size:13px;margin-bottom:18px}.breadcrumbs a{color:#dffbff}@media(max-width:860px){.site-nav{padding:12px 16px}.site-nav nav{gap:10px;font-size:13px}.article-wrap{grid-template-columns:1fr}.side{position:static}.article p,.article li{font-size:16px;line-height:1.72}.cta ul{grid-template-columns:1fr}.post-nav{grid-template-columns:1fr}.hero-image{border-radius:18px}}`;
}

function articlePage(post, prev, next) {
  const pathname = `/blog/${post.slug}`;
  const url = canonical(pathname);
  const image = post.heroImage.startsWith('http') ? post.heroImage : SITE_URL + post.heroImage;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE_URL + '/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'MindGains', logo: { '@type': 'ImageObject', url: SITE_URL + '/assets/icons/mindgains-logo-512.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  const related = post.relatedQuizzes.map((quiz) => `<a href="${attr(quiz)}">${htmlEscape(relatedTitle(quiz))}</a>`).join('');
  const body = `<section class="blog-hero">
    <div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/blog/">Blog</a></div>
    <p class="eyebrow">MindGains Blog</p>
    <h1>${htmlEscape(post.title)}</h1>
    <p class="dek">${htmlEscape(post.description)}</p>
    <div class="meta-row"><span>${htmlEscape(post.author)}</span><span>${htmlEscape(formatDate(post.publishedDate))}</span><span>${htmlEscape(post.readingTime)}</span></div>
  </section>
  <figure class="hero-image"><img src="${attr(post.heroImage)}" alt="${attr(post.heroAlt || post.title)}" width="1600" height="900" /></figure>
  <div class="article-wrap">
    <article class="article">${markdownToHtml(post.body)}
      <section class="related"><h2>Related Quizzes</h2><div class="quiz-links">${related}</div></section>
      <section class="cta"><p class="eyebrow">Continue Your Learning Journey</p><h2>Make Learning a Daily Habit.</h2><p>Join the MindGains Early Access Waitlist.</p><ul><li>Daily Dose</li><li>MIGA AI</li><li>AI-generated lessons from PDFs, YouTube and any topic</li><li>200,000+ quizzes</li><li>Streaks &amp; XP</li><li>State Leaderboards</li><li>Current Affairs</li></ul><a class="button" href="/#join">Join the Waitlist</a></section>
      <nav class="post-nav"><div>${prev ? `Previous<br /><a href="/blog/${prev.slug}">${htmlEscape(prev.title)}</a>` : 'Previous<br />More articles coming soon'}</div><div>${next ? `Next<br /><a href="/blog/${next.slug}">${htmlEscape(next.title)}</a>` : 'Next<br />More articles coming soon'}</div></nav>
    </article>
    <aside class="side"><h2>Practice after reading</h2><p>Turn ideas into recall with MindGains public quizzes.</p><a href="/quiz/">Open Quiz Hub</a></aside>
  </div>`;
  return pageShell({ title: `${post.title} | MindGains`, description: post.description, pathname, image: post.heroImage, body, schema: [blogPosting, breadcrumb] });
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value + 'T00:00:00Z'));
}

function indexPage(posts) {
  const body = `<section class="blog-hero"><p class="eyebrow">MindGains Blog</p><h1>Ideas for India's daily learning habit.</h1><p class="dek">Research, product thinking and practical learning notes from the MindGains team.</p></section><section class="blog-list"><h2>Latest Articles</h2>${posts.map((post) => `<a class="blog-card" href="/blog/${post.slug}"><h2>${htmlEscape(post.title)}</h2><p>${htmlEscape(post.description)}</p><div class="meta-row"><span>${htmlEscape(formatDate(post.publishedDate))}</span><span>${htmlEscape(post.readingTime)}</span></div></a>`).join('')}</section>`;
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE_URL + '/blog/' }] };
  return pageShell({ title: 'MindGains Blog | Daily Learning in India', description: 'MindGains articles on Indian students, learning habits, quizzes, AI lessons and exam preparation.', pathname: '/blog/', image: '/assets/blog/india-learning-crisis.png', body, schema: [breadcrumb] });
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function updateHome() {
  const home = path.join(ROOT, 'index.html');
  if (!fs.existsSync(home)) return;
  let html = fs.readFileSync(home, 'utf8');
  if (!html.includes('href="/blog/"')) {
    html = html.replace('<div class="nav-links"><a href="/quiz/">Quiz Hub</a></div>', '<div class="nav-links"><a href="/blog/">Blog</a><a href="/quiz/">Quiz Hub</a></div>');
  }
  fs.writeFileSync(home, html, 'utf8');
}

function updateSitemap(paths) {
  const sitemap = path.join(ROOT, 'sitemap.xml');
  const existing = fs.existsSync(sitemap) ? fs.readFileSync(sitemap, 'utf8') : '';
  const locs = [...existing.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1])
    .filter((loc) => !loc.startsWith(SITE_URL + '/blog'));
  for (const p of paths) {
    const url = canonical(p);
    if (!locs.includes(url)) locs.push(url);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs.map((loc) => `  <url><loc>${htmlEscape(loc)}</loc><changefreq>weekly</changefreq><priority>${loc.endsWith('/blog/') ? '0.8' : loc.includes('/blog/') ? '0.7' : loc.endsWith('/quiz/') ? '0.9' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(sitemap, xml, 'utf8');
}

function main() {
  const posts = fs.readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => parsePost(path.join(CONTENT_DIR, name)))
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
  if (!posts.length) throw new Error('No blog posts found');

  writeFile(path.join(ROOT, 'assets', 'blog.css'), blogCss());
  writeFile(path.join(ROOT, 'blog', 'index.html'), indexPage(posts));

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    writeFile(path.join(ROOT, 'blog', post.slug, 'index.html'), articlePage(post, posts[i + 1], posts[i - 1]));
  }

  updateHome();
  updateSitemap(['/blog/', ...posts.map((post) => `/blog/${post.slug}`)]);
  console.log(`Generated ${posts.length} blog article(s).`);
}

main();
