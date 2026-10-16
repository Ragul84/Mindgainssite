// Hall of Fame on the homepage NationLap band: today's India top 5 from the server graded
// current affairs board. Names and XP only. If the board is empty the placeholder stays.
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
    if (!Array.isArray(rows) || !rows.length) return;
    box.innerHTML = '<p class="nl-hk">Hall of Fame today</p><ol>' + rows.map((r) => `<li><i>${Number(r.rank)}</i><span>${esc(r.name)}</span><em>${Number(r.xp)} XP</em></li>`).join('') + '</ol>';
  });
})();
