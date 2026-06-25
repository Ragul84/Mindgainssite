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
    author: meta.author || 'Ragul Arvind',
    category: meta.category || 'Learning',
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
  const title = slug
    .replace(/class(\d+)/i, 'Class $1')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${title} Quiz`;
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
<div class="reading-progress" aria-hidden="true"><span></span></div>
<header class="site-nav">
  <a class="brand" href="/"><span></span>MindGains</a>
  <nav><a href="/editorial/">Editorial</a><a href="/quiz/">Quiz Hub</a><a href="/#join">Waitlist</a></nav>
</header>
<main>${body}</main>
<script>
const progress=document.querySelector('.reading-progress span');
function updateReadingProgress(){const doc=document.documentElement;const max=doc.scrollHeight-doc.clientHeight;progress.style.transform='scaleX('+(max>0?window.scrollY/max:0)+')';}
updateReadingProgress();
window.addEventListener('scroll',updateReadingProgress,{passive:true});
window.addEventListener('resize',updateReadingProgress);
</script>
</body>
</html>`;
}

function blogCss() {
  return `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.18),transparent 34%),radial-gradient(circle at 10% 10%,rgba(125,108,255,.13),transparent 32%),linear-gradient(180deg,#05060a,#08111c 56%,#030407)}.reading-progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:40;background:rgba(255,255,255,.04)}.reading-progress span{display:block;width:100%;height:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#37e0ff,#8ff6ff);box-shadow:0 0 18px rgba(55,224,255,.5)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.72);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:10px;font-weight:700}.brand span{width:10px;height:10px;border-radius:99px;background:linear-gradient(135deg,#37e0ff,#7d6cff);box-shadow:0 0 22px #37e0ff}.site-nav nav{display:flex;gap:18px;color:#cbd5e1;font-size:14px}main{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:28px 0 64px}.blog-hero{padding:34px 0 22px}.eyebrow{margin:0 0 10px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:700}.blog-hero h1{max-width:980px;font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(42px,7vw,82px);line-height:.95;margin:0;letter-spacing:0;font-weight:400}.dek{max-width:760px;color:rgba(248,251,255,.76);font-size:clamp(16px,1.8vw,20px);line-height:1.55;margin:16px 0 0}.meta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;color:#cbd5e1;font-size:14px}.meta-row span,.chip{padding:9px 12px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(255,255,255,.055)}.hero-image{margin:20px 0 30px;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);max-height:420px}.hero-image img{display:block;width:100%;height:100%;max-height:420px;object-fit:cover;object-position:center}.article-wrap{display:grid;grid-template-columns:minmax(0,760px) minmax(240px,1fr);gap:36px;align-items:start}.article{padding:4px 0}.article p,.article li{color:#d7e2f2;font-size:18px;line-height:1.78}.article p{margin:0 0 22px}.article h2{font-size:clamp(30px,4vw,46px);line-height:1.05;margin:44px 0 14px;font-family:"Instrument Serif",serif;font-weight:400;font-style:italic}.article h3{font-size:22px;line-height:1.25;margin:28px 0 10px}.article ol{padding-left:24px;margin:0 0 24px}.article a{color:#67e8f9}.side{position:sticky;top:84px;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:18px;background:rgba(255,255,255,.055)}.side h2{font-size:18px;margin:0 0 10px}.side p{color:#aebbd0;line-height:1.55;margin:0 0 14px}.side a{display:inline-flex;padding:12px 14px;border-radius:14px;background:#37e0ff;color:#001014;font-weight:800}.related,.cta,.post-nav,.blog-list,.featured,.category-strip,.editorial-grid{margin-top:34px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));padding:22px}.related h2,.cta h2,.blog-list h2,.featured h2,.editorial-grid h2{font-size:30px;margin:0 0 14px}.quiz-links{display:grid;gap:10px}.quiz-links a{padding:15px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);color:#e8fbff}.cta p{max-width:720px;color:#d7e2f2;line-height:1.6}.cta ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;color:#dffbff;padding-left:20px}.button{display:inline-flex;margin-top:12px;padding:14px 18px;border-radius:16px;background:#0891b2;color:#fff;font-weight:800}.post-nav{display:grid;grid-template-columns:1fr 1fr;gap:12px}.post-nav div{min-height:64px;padding:14px;border-radius:16px;background:rgba(255,255,255,.055);color:#91a4bd}.post-nav a{color:#e8fbff;font-weight:700}.blog-card{display:block;padding:18px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1)}.blog-card h2{font-size:26px;margin:0 0 8px}.blog-card p{color:#b8c4d6;line-height:1.55;margin:0 0 12px}.breadcrumbs{display:flex;gap:8px;flex-wrap:wrap;color:#91a4bd;font-size:13px;margin-bottom:18px}.breadcrumbs a{color:#dffbff}.category-strip{display:flex;gap:10px;flex-wrap:wrap}.chip{color:#dffbff;font-size:13px}.featured-card{display:grid;grid-template-columns:minmax(0,.92fr) minmax(320px,1fr);gap:22px;align-items:stretch}.featured-copy{padding:8px 0}.featured-copy h2{font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(34px,4.5vw,58px);line-height:1;margin:8px 0 12px;font-weight:400}.featured-copy p,.editorial-card p{color:#b8c4d6;line-height:1.6}.featured-image,.editorial-card img{width:100%;height:100%;min-height:250px;object-fit:cover;border-radius:18px;border:1px solid rgba(255,255,255,.1)}.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.editorial-card{display:flex;flex-direction:column;gap:12px;padding:14px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1)}.editorial-card img{aspect-ratio:16/10;min-height:0}.editorial-card h3{font-size:22px;line-height:1.16;margin:0}.editorial-card .meta-row{margin-top:auto}.blog-card h2{font-size:26px;margin:0 0 8px}.blog-card p{color:#b8c4d6;line-height:1.55;margin:0 0 12px}@media(max-width:860px){.site-nav{padding:12px 16px}.site-nav nav{gap:10px;font-size:13px}.article-wrap,.featured-card{grid-template-columns:1fr}.side{position:static}.article p,.article li{font-size:16px;line-height:1.72}.cta ul{grid-template-columns:1fr}.post-nav{grid-template-columns:1fr}.hero-image{border-radius:18px;max-height:280px}.hero-image img{max-height:280px}.card-grid{grid-template-columns:1fr}.featured-image{min-height:210px}}`;
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
      { '@type': 'ListItem', position: 2, name: 'Editorial', item: SITE_URL + '/editorial/' },
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
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'MindGains', logo: { '@type': 'ImageObject', url: SITE_URL + '/assets/icons/mindgains-logo-512.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  const related = post.relatedQuizzes.map((quiz) => `<a href="${attr(quiz)}">${htmlEscape(relatedTitle(quiz))}</a>`).join('');
  const postNav = prev || next
    ? `<nav class="post-nav"><div>${prev ? `&larr; Previous<br /><a href="/blog/${prev.slug}">${htmlEscape(prev.title)}</a>` : ''}</div><div>${next ? `Next &rarr;<br /><a href="/blog/${next.slug}">${htmlEscape(next.title)}</a>` : ''}</div></nav>`
    : '';
  const body = `<section class="blog-hero">
    <div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/editorial/">Editorial</a></div>
    <p class="eyebrow">MindGains Editorial</p>
    <h1>${htmlEscape(post.title)}</h1>
    <p class="dek">${htmlEscape(post.description)}</p>
    <div class="meta-row"><span>MindGains Editorial</span><span>${htmlEscape(post.author)}</span><span>Published ${htmlEscape(formatDate(post.publishedDate))}</span><span>${htmlEscape(post.readingTime)}</span></div>
  </section>
  <figure class="hero-image"><img src="${attr(post.heroImage)}" alt="${attr(post.heroAlt || post.title)}" width="1600" height="900" /></figure>
  <div class="article-wrap">
    <article class="article">${markdownToHtml(post.body)}
      <section class="related"><h2>Related Quizzes</h2><div class="quiz-links">${related}</div></section>
      <section class="cta"><p class="eyebrow">Continue Your Learning Journey</p><h2>Make Learning a Daily Habit.</h2><p>Join the MindGains Early Access Waitlist.</p><a class="button" href="/#join">Join the Waitlist</a></section>
      ${postNav}
    </article>
    <aside class="side"><h2>Practice after reading</h2><p>Turn ideas into recall with MindGains public quizzes.</p><a href="/quiz/">Open Quiz Hub</a></aside>
  </div>`;
  return pageShell({ title: `${post.title} | MindGains`, description: post.description, pathname, image: post.heroImage, body, schema: [blogPosting, breadcrumb] });
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value + 'T00:00:00Z'));
}

function articleHref(post) {
  return `/blog/${post.slug}`;
}

function indexPage(posts) {
  const body = `<section class="blog-hero"><p class="eyebrow">MindGains Editorial</p><h1>Ideas for India's daily learning habit.</h1><p class="dek">Research, product thinking and practical learning notes from the MindGains team.</p></section><section class="blog-list"><h2>Latest Articles</h2>${posts.map((post) => `<a class="blog-card" href="${articleHref(post)}"><h2>${htmlEscape(post.title)}</h2><p>${htmlEscape(post.description)}</p><div class="meta-row"><span>${htmlEscape(post.category)}</span><span>${htmlEscape(post.author)}</span><span>Published ${htmlEscape(formatDate(post.publishedDate))}</span><span>${htmlEscape(post.readingTime)}</span></div></a>`).join('')}</section>`;
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: 'Editorial', item: SITE_URL + '/blog/' }] };
  return pageShell({ title: 'MindGains Editorial | Daily Learning in India', description: 'MindGains Editorial on Indian students, learning habits, quizzes, AI lessons and exam preparation.', pathname: '/blog/', image: '/assets/blog/india-learning-crisis.png', body, schema: [breadcrumb] });
}

function editorialPage(posts) {
  const featured = posts[0];
  const categories = ['Learning Psychology', 'Exams', 'Current Affairs', 'AI in Education', 'Daily Learning', 'Quiz Practice'];
  const featuredHtml = featured ? `<section class="featured">
    <p class="eyebrow">Featured</p>
    <a class="featured-card" href="${articleHref(featured)}">
      <div class="featured-copy">
        <div class="meta-row"><span>${htmlEscape(featured.category)}</span><span>${htmlEscape(featured.readingTime)}</span></div>
        <h2>${htmlEscape(featured.title)}</h2>
        <p>${htmlEscape(featured.description)}</p>
        <div class="meta-row"><span>${htmlEscape(featured.author)}</span><span>Published ${htmlEscape(formatDate(featured.publishedDate))}</span></div>
      </div>
      <img class="featured-image" src="${attr(featured.heroImage)}" alt="${attr(featured.heroAlt || featured.title)}" width="1600" height="900" />
    </a>
  </section>` : '';
  const cards = posts.map((post) => `<a class="editorial-card" href="${articleHref(post)}">
    <img src="${attr(post.heroImage)}" alt="${attr(post.heroAlt || post.title)}" width="800" height="500" />
    <div class="meta-row"><span>${htmlEscape(post.category)}</span><span>${htmlEscape(post.readingTime)}</span></div>
    <h3>${htmlEscape(post.title)}</h3>
    <p>${htmlEscape(post.description)}</p>
  </a>`).join('');
  const body = `<section class="blog-hero"><p class="eyebrow">MindGains Editorial</p><h1>India's daily learning publication.</h1><p class="dek">Essays and field notes on learning psychology, exams, current affairs, AI in education and the habit systems Indian learners need.</p></section>
  <section class="category-strip">${categories.map((category) => `<span class="chip">${htmlEscape(category)}</span>`).join('')}</section>
  ${featuredHtml}
  <section class="editorial-grid"><h2>Latest from Editorial</h2><div class="card-grid">${cards}</div></section>`;
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: 'Editorial', item: SITE_URL + '/editorial/' }] };
  const collection = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'MindGains Editorial', description: 'MindGains Editorial on learning psychology, exams, current affairs and AI in education.', url: SITE_URL + '/editorial/' };
  return pageShell({ title: 'MindGains Editorial | Learning Psychology, Exams and AI in Education', description: 'MindGains Editorial publishes thoughtful essays on Indian learning habits, exams, current affairs, quiz practice and AI in education.', pathname: '/editorial/', image: featured?.heroImage || '/assets/icons/mindgains-logo-512.png', body, schema: [collection, breadcrumb] });
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
    html = html.replace('<div class="nav-links"><a href="/quiz/">Quiz Hub</a></div>', '<div class="nav-links"><a href="/blog/">Editorial</a><a href="/quiz/">Quiz Hub</a></div>');
  }
  html = html.replace(/<a href="\/blog\/">Blog<\/a>/g, '<a href="/editorial/">Editorial</a>');
  html = html.replace(/<a href="\/blog\/">Editorial<\/a>/g, '<a href="/editorial/">Editorial</a>');
  fs.writeFileSync(home, html, 'utf8');
}

function updateSitemap(paths) {
  const sitemap = path.join(ROOT, 'sitemap.xml');
  const existing = fs.existsSync(sitemap) ? fs.readFileSync(sitemap, 'utf8') : '';
  const locs = [...existing.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1])
    .filter((loc) => !loc.startsWith(SITE_URL + '/blog') && !loc.startsWith(SITE_URL + '/editorial'));
  for (const p of paths) {
    const url = canonical(p);
    if (!locs.includes(url)) locs.push(url);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs.map((loc) => `  <url><loc>${htmlEscape(loc)}</loc><changefreq>weekly</changefreq><priority>${loc.endsWith('/editorial/') ? '0.85' : loc.endsWith('/blog/') ? '0.6' : loc.includes('/blog/') ? '0.7' : loc.endsWith('/quiz/') ? '0.9' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`;
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
  writeFile(path.join(ROOT, 'editorial', 'index.html'), editorialPage(posts));

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    writeFile(path.join(ROOT, 'blog', post.slug, 'index.html'), articlePage(post, posts[i + 1], posts[i - 1]));
  }

  updateHome();
  updateSitemap(['/editorial/', ...posts.map((post) => `/blog/${post.slug}`)]);
  console.log(`Generated ${posts.length} blog article(s).`);
}

main();
