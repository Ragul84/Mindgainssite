const fs = require('fs');
const path = require('path');

function updateHtml(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') updateHtml(full);
    } else if (f.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;

      if (content.includes('<a class="brand" href="/">MindGains</a>')) {
        content = content.replace(/<a class="brand" href="\/">MindGains<\/a>/g, '<a class="brand" href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="MindGains Logo" />MindGains AI</a>');
        changed = true;
      }
      if (content.includes('href="/#join"')) {
        content = content.replace(/href="\/#join"/g, 'href="/waitlist.html"');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated:', full);
      }
    }
  });
}

updateHtml('C:/mindgains-waitlist');
console.log('Batch update complete!');
