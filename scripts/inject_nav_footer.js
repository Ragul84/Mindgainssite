const fs = require('fs');
const path = require('path');

// The shared footer HTML to inject into all subpages
const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-brand-row">
        <img src="/assets/icons/mindgains-logo-192.png" alt="MindGains Logo" />
        <strong>MindGains AI</strong>
      </div>
      <p>The AI Built for Indian Exams. Grounded in your textbooks, aligned with your curriculum, enhanced by PYQ intelligence.</p>
      <span class="footer-badge">BETA · India&rsquo;s 1st Textbook-Aware Exam AI</span>
    </div>

    <div class="footer-col">
      <h4>Exams</h4>
      <ul>
        <li><a href="/tnpsc/">TNPSC Group 1, 2 &amp; 4</a></li>
        <li><a href="/upsc/">UPSC CSE Prelims</a></li>
        <li><a href="/ssc/">SSC &amp; Railway</a></li>
        <li><a href="/waitlist.html">Join Whitelist</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Textbooks</h4>
      <ul>
        <li><a href="/samacheer/">Samacheer Kalvi</a></li>
        <li><a href="/ncert/">NCERT Notes</a></li>
        <li><a href="/editorial/">Editorial Summaries</a></li>
        <li><a href="/daily-dose/">Daily Dose</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Tools</h4>
      <ul>
        <li><a href="/quiz/">Adaptive Quiz Hub</a></li>
        <li><a href="/know-your-india/">Know Your India</a></li>
        <li><a href="/study-lab/">Study Lab</a></li>
        <li><a href="/misa/">MISA AI Tutor</a></li>
        <li><a href="/blog/">Blog</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 MindGains AI &middot; All rights reserved.</span>
    <span>All official PYQs are property of respective government exam boards.</span>
  </div>
</footer>`;

// Updated nav for subpages
const OLD_NAV_PATTERN = /<header class="site-nav">[\s\S]*?<\/header>/;
function buildNav(active) {
  const links = [
    { href: '/upsc/', label: 'UPSC' },
    { href: '/tnpsc/', label: 'TNPSC' },
    { href: '/ssc/', label: 'SSC' },
    { href: '/quiz/', label: 'Quiz Hub' },
    { href: '/know-your-india/', label: 'Know India' },
    { href: '/editorial/', label: 'Editorial' },
    { href: '/samacheer/', label: 'Samacheer' },
  ];
  const navLinks = links.map(l => `<a href="${l.href}"${active===l.href?' style="color:#fff;"':''}>${l.label}</a>`).join('');
  return `<header class="site-nav">
  <a class="brand" href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="MindGains Logo" />MindGains AI</a>
  <nav>${navLinks}</nav>
  <a class="nav-cta" href="/waitlist.html">Join Waitlist</a>
</header>`;
}

// Map of file path → active nav href
const pages = {
  'C:/mindgains-waitlist/tnpsc/index.html': '/tnpsc/',
  'C:/mindgains-waitlist/upsc/index.html': '/upsc/',
  'C:/mindgains-waitlist/ssc/index.html': '/ssc/',
  'C:/mindgains-waitlist/quiz/index.html': '/quiz/',
  'C:/mindgains-waitlist/samacheer/index.html': '/samacheer/',
  'C:/mindgains-waitlist/ncert/index.html': '/ncert/',
  'C:/mindgains-waitlist/editorial/index.html': '/editorial/',
  'C:/mindgains-waitlist/daily-dose/index.html': '/daily-dose/',
  'C:/mindgains-waitlist/know-your-india/index.html': '/know-your-india/',
  'C:/mindgains-waitlist/study-lab/index.html': '/study-lab/',
  'C:/mindgains-waitlist/misa/index.html': '/misa/',
  'C:/mindgains-waitlist/blog/index.html': '/blog/',
};

let updatedCount = 0;

for (const [filePath, activeHref] of Object.entries(pages)) {
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace/update the header nav
  const newNav = buildNav(activeHref);
  if (OLD_NAV_PATTERN.test(content)) {
    content = content.replace(OLD_NAV_PATTERN, newNav);
    changed = true;
  }

  // 2. Remove old footer if present (old simple one), insert new footer before </body>
  // Remove existing site-footer if already there
  content = content.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/g, '');

  // Insert before </body>
  if (content.includes('</body>')) {
    content = content.replace('</body>', FOOTER_HTML + '\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log('✅ Updated:', filePath);
  }
}

console.log(`\nDone. Updated ${updatedCount} pages.`);
