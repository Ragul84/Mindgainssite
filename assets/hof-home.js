// "Today's toppers" strip on the homepage: India top 5 from the server-graded current-affairs
// board. Names only (first name + initial as stored), XP and accuracy.
(() => {
  const box = document.querySelector('[data-hof]');
  if (!box) return;
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';
  const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  fetch('https://yuntwerxahgmaoduxvqc.supabase.co/rest/v1/rpc/ca_board', {
    method: 'POST',
    headers: { apikey: ANON, authorization: 'Bearer ' + ANON, 'content-type': 'application/json' },
    body: JSON.stringify({ period: 'today', lim: 5 }),
  }).then((r) => (r.ok ? r.json() : [])).catch(() => []).then((rows) => {
    // Nothing to brag about yet: show nothing rather than an empty trophy case.
    if (!rows.length) { box.remove(); return; }
    box.innerHTML = `<span class="hh-k">🏛 Today's toppers · India</span>${rows.map((r) => `<span class="hh-r"><b>#${r.rank}</b> ${esc(r.name)} <em>${r.xp} XP</em></span>`).join('')}<a href="/nationlap/?affairs=1">Race today →</a>`;
    box.hidden = false;
  });
})();
