// Hall of Fame: weekly Cut-Off Run podium and live board, fed by the server-marked league.
(() => {
  const root = document.querySelector('[data-hof-v2]');
  if (!root) return;
  const API = root.dataset.api || '/api/game/league';
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
  const METAL = { 1: ['#fff6cf', '#efc554', '#b8861f', '#7a5410'], 2: ['#ffffff', '#d6dde6', '#9aa4b2', '#5d6878'], 3: ['#ffe6cf', '#dc9a62', '#a35f2c', '#6c3815'] };
  const AV = ['#4f46e5', '#0b7a72', '#7c3aed', '#0369a1', '#be185d', '#b45309', '#15803d'];
  // The original robed figure holding up a book (1st), torch (2nd) or bowl (3rd), redrawn:
  // a real pedestal under the feet, an A-line robe with folds, tapered arms with hands, a neck,
  // a cleaner head and hair, and a brighter metal with a specular edge.
  const statue = (r) => {
    const [a, b, c, d] = METAL[r], g = 'hg' + r;
    return `<svg viewBox="0 0 150 200" aria-hidden="true"><defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}"/><stop offset=".22" stop-color="${a}"/><stop offset=".48" stop-color="${b}"/><stop offset=".8" stop-color="${c}"/><stop offset="1" stop-color="${d}"/></linearGradient>
      <linearGradient id="${g}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${c}"/></linearGradient>
      <linearGradient id="${g}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset="1" stop-color="#d3dae3"/></linearGradient></defs>
      <rect x="40" y="168" width="70" height="7" rx="2" fill="url(#${g}p)" stroke="#bcc5d1"/>
      <rect x="46" y="175" width="58" height="14" fill="url(#${g}p)" stroke="#bcc5d1"/>
      <rect x="36" y="189" width="78" height="8" rx="2" fill="url(#${g}p)" stroke="#bcc5d1"/>
      <path d="M58 97c-3 22-8 46-12 71h58c-4-25-9-49-12-71z" fill="url(#${g})" stroke="${d}" stroke-opacity=".35" stroke-width="1"/>
      <path d="M66 104c-1 20-3 42-5 62M75 102v66M84 104c1 20 3 42 5 62" stroke="${d}" stroke-opacity=".25" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M58 99c-9 6-14 18-15 30" fill="none" stroke="url(#${g})" stroke-width="8" stroke-linecap="round"/>
      <circle cx="43" cy="131" r="4.5" fill="url(#${g}v)"/>
      <path d="M92 99c7-12 11-28 12-46" fill="none" stroke="url(#${g})" stroke-width="8" stroke-linecap="round"/>
      <circle cx="104" cy="51" r="4.5" fill="url(#${g}v)"/>
      ${r === 1 ? `<g transform="translate(104 34) rotate(-10)"><rect x="-15" y="-11" width="30" height="21" rx="2" fill="url(#${g}v)" stroke="${d}" stroke-opacity=".5"/><path d="M0-11v21" stroke="${d}" stroke-opacity=".45"/></g>`
        : r === 2 ? `<g transform="translate(104 38)"><path d="M-5-6h10l-2 12h-6z" fill="url(#${g}v)"/><path d="M0-22c6 6 7 10 0 16c-7-6-6-10 0-16z" fill="url(#${g}v)" stroke="${d}" stroke-opacity=".35"/></g>`
        : `<g transform="translate(104 38)"><path d="M-13-5c0 13 26 13 26 0z" fill="url(#${g}v)" stroke="${d}" stroke-opacity=".35"/></g>`}
      <path d="M57 98c4-6 11-8 18-8s14 2 18 8z" fill="url(#${g})"/>
      <path d="M70 80h10v12H70z" fill="url(#${g}v)"/>
      <ellipse cx="75" cy="66" rx="14" ry="16.5" fill="url(#${g})" stroke="${d}" stroke-opacity=".3" stroke-width="1"/>
      <path d="M61 63c0-12 6-18 14-18s14 6 14 18c-3-6-8-9-14-9s-11 3-14 9z" fill="${c}"/>
      ${r === 1 ? `<path d="M60 53c5-6 10-8 15-8s10 2 15 8" stroke="#9cc46b" stroke-width="3.5" fill="none" stroke-dasharray="3 3" stroke-linecap="round"/>` : ''}
      <path d="M68 60c-1 8 0 15 2 20" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M57 108c-3 20-6 40-8 56" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  };
  const initials = (n) => String(n || '?').split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const state = { exam: '', city: '' };

  root.innerHTML = `<div class="hof-card">
    <div class="hof-top">
      <div><span class="hof-k"><i></i>Live this week</span><h2 id="hof-h">Hall of Fame</h2>
        <p class="hof-sub">The week's top three get a statue on this page. Points come only from answers our server marks, so every place here is earned.</p></div>
      <div class="hof-reset"><span>New week in</span><div class="hof-cd" data-cd><b>0<small>DAYS</small></b><b>0<small>HRS</small></b><b>0<small>MIN</small></b><b>0<small>SEC</small></b></div></div>
    </div>
    <div class="hof-body"><div class="hof-stage" data-stage></div>
    <div class="hof-board">
      <div class="hof-fl"><div class="hof-tabs" role="group" aria-label="Exam" data-tabs></div>
        <select class="hof-city" aria-label="City" data-city><option value="">All of India</option></select></div>
      <ol class="hof-list" data-list>${'<li class="hof-row"><span></span><span class="hof-av" style="background:#eef1f5"></span><div class="hof-skel"></div><span></span></li>'.repeat(5)}</ol>
      <div class="hof-foot"><span data-count>Loading the board</span><a href="/play/cutoff-run/">Play Cut-Off Run to climb</a></div>
    </div></div></div>`;
  const $ = (s) => root.querySelector(s);
  let resetAt = 0;
  const tick = () => {
    if (!resetAt) return;
    let s = Math.max(0, Math.floor((resetAt - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    $('[data-cd]').querySelectorAll('b').forEach((b, i) => { b.firstChild.nodeValue = String(v[i]).padStart(i ? 2 : 1, '0'); });
    if (s === 0) { resetAt = 0; setTimeout(load, 4000); }
  };
  setInterval(tick, 1000);

  const podium = (rows) => {
    const order = [2, 1, 3];
    $('[data-stage]').innerHTML = order.map((r) => {
      const p = rows[r - 1];
      return `<div class="hof-st p${r}${p ? '' : ' hof-empty'}"><div class="hof-fig">${statue(r)}</div>
        <div class="hof-ped"><span class="hof-rk">${['', '1ST', '2ND', '3RD'][r]}</span>
        <span class="hof-nm">${p ? esc(p.name) : 'Open spot'}</span>
        <span class="hof-mt">${p ? esc([p.city, p.exam].filter(Boolean).join(', ')) : 'Play this week'}</span>
        ${p ? `<span class="hof-sc">${fmt(p.score)}<small>pts</small></span>` : ''}</div></div>`;
    }).join('');
  };
  const board = (d) => {
    const rows = d.rows || [];
    $('[data-list]').innerHTML = rows.length ? rows.map((p) => `<li class="hof-row${p.me ? ' me' : ''}"><span class="hof-n">${p.rank}</span>
        <span class="hof-av" style="background:${AV[(p.name || '').length % AV.length]}">${esc(initials(p.name))}</span>
        <div class="hof-who"><b>${esc(p.name)}${p.me ? ' (you)' : ''}</b><span>${esc(p.city || 'India')}${p.exam ? `<em class="hof-tag">${esc(p.exam)}</em>` : ''}</span></div>
        <span class="hof-pts">${fmt(p.score)}<small>points</small></span></li>`).join('')
      : `<li class="hof-none">No runs yet for this filter this week. The first good run takes the top spot.</li>`;
    $('[data-count]').textContent = d.players ? `${fmt(d.players)} ${d.players === 1 ? 'player' : 'players'} on the board this week` : 'The board is open';
  };
  const filters = (d) => {
    const ex = ['', ...(d.exams || [])];
    const tabs = $('[data-tabs]');
    if (!tabs.dataset.ready) {
      tabs.innerHTML = ex.map((e) => `<button type="button" class="hof-tab" data-e="${esc(e)}" aria-pressed="${e === state.exam}">${e ? esc(e.toUpperCase()) : 'All exams'}</button>`).join('');
      tabs.dataset.ready = 1;
      tabs.onclick = (ev) => { const b = ev.target.closest('[data-e]'); if (!b) return; state.exam = b.dataset.e; tabs.querySelectorAll('.hof-tab').forEach((t) => t.setAttribute('aria-pressed', t === b)); load(); };
    }
    const sel = $('[data-city]');
    if (!sel.dataset.ready) {
      sel.innerHTML = '<option value="">All of India</option>' + (d.cities || []).slice().sort().map((c) => `<option>${esc(c)}</option>`).join('');
      sel.dataset.ready = 1;
      sel.onchange = () => { state.city = sel.value; load(); };
    }
  };
  let first = true, seq = 0;
  async function load() {
    const my = ++seq;
    const q = new URLSearchParams({ v: '2', limit: '10' });
    if (state.exam) q.set('exam', state.exam);
    if (state.city) q.set('city', state.city);
    try {
      const d = await (await fetch(`${API}?${q}`, { headers: { accept: 'application/json' } })).json();
      if (my !== seq) return;
      resetAt = d.resets_at; tick();
      if (first) { filters(d); first = false; }
      podium(d.rows || []); board(d);
    } catch {
      $('[data-count]').textContent = 'The board is taking a break. Try again in a minute.';
      if (first) podium([]);
    }
  }
  load();
  setInterval(() => { if (!document.hidden) load(); }, 30000);
})();
