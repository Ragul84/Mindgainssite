const fs = require('fs');
const path = require('path');

const LIQUID_FOOTER = `
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-brand-row">
        <img src="/assets/icons/mindgains-logo-192.png" alt="MindGains Logo" />
        <strong>MindGains AI</strong>
      </div>
      <p>The AI Built for Indian Exams. Grounded in your textbooks, aligned with your curriculum, enhanced by PYQ intelligence.</p>
      <span class="footer-badge">BETA &middot; India&rsquo;s 1st Textbook-Aware Exam AI</span>
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

const FULL_NAV = (active) => {
  const links = [
    ['/upsc/', 'UPSC'],
    ['/tnpsc/', 'TNPSC'],
    ['/ssc/', 'SSC'],
    ['/quiz/', 'Quiz Hub'],
    ['/editorial/', 'Editorial'],
    ['/know-your-india/', 'Know India'],
    ['/samacheer/', 'Samacheer'],
  ];
  const navItems = links.map(([href, label]) =>
    `<a href="${href}"${href === active ? ' style="color:#fff;"' : ''}>${label}</a>`
  ).join('');
  return `<header class="site-nav">
  <a class="brand" href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="MindGains Logo" />MindGains AI</a>
  <nav>${navItems}</nav>
  <a class="nav-cta" href="/waitlist.html">Join Whitelist</a>
</header>`;
};

const OLD_NAV_PATTERN = /<header class="site-nav">[\s\S]*?<\/header>/;
const OLD_FOOTER_PATTERN = /<footer[\s\S]*?<\/footer>/g;

function processFile(filePath, activeHref) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace nav
  if (OLD_NAV_PATTERN.test(content)) {
    content = content.replace(OLD_NAV_PATTERN, FULL_NAV(activeHref));
  }

  // Remove all old footers
  content = content.replace(OLD_FOOTER_PATTERN, '');

  // Inject new footer before </body>
  content = content.replace('</body>', LIQUID_FOOTER + '\n</body>');

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Walk all HTML files under a directory
function walkAndUpdate(dir, activeHref) {
  let count = 0;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && f !== 'node_modules' && f !== '.git') {
      count += walkAndUpdate(full, activeHref);
    } else if (f.endsWith('.html')) {
      if (processFile(full, activeHref)) {
        console.log('✅', full);
        count++;
      }
    }
  });
  return count;
}

// Process hub pages with their active nav
const hubs = [
  ['C:/mindgains-waitlist/tnpsc/index.html', '/tnpsc/'],
  ['C:/mindgains-waitlist/upsc/index.html', '/upsc/'],
  ['C:/mindgains-waitlist/ssc/index.html', '/ssc/'],
  ['C:/mindgains-waitlist/samacheer/index.html', '/samacheer/'],
  ['C:/mindgains-waitlist/ncert/index.html', '/ncert/'],
  ['C:/mindgains-waitlist/editorial/index.html', '/editorial/'],
  ['C:/mindgains-waitlist/daily-dose/index.html', '/daily-dose/'],
  ['C:/mindgains-waitlist/know-your-india/index.html', '/know-your-india/'],
  ['C:/mindgains-waitlist/study-lab/index.html', '/study-lab/'],
  ['C:/mindgains-waitlist/misa/index.html', '/misa/'],
  ['C:/mindgains-waitlist/blog/index.html', '/blog/'],
];

let total = 0;
for (const [fp, active] of hubs) {
  if (processFile(fp, active)) { console.log('✅ Hub:', fp); total++; }
}

// Process ALL quiz pages (they all use /quiz/ as active)
console.log('\n--- Quiz pages ---');
total += walkAndUpdate('C:/mindgains-waitlist/quiz', '/quiz/');

console.log(`\n✅ Done. Total updated: ${total}`);
