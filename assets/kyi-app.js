(() => {
  const ROOT_ID = 'kyi-ui';
  const STORAGE_KEY = 'mindgains_kyi_progress_v1';
  const DATA = {
    meta: null,
    gk: null,
    lessons: null,
    mp: null,
    mla: null,
  };

  const state = {
    ready: false,
    activeState: null,
    previewing: null,
    heroImg: null,
    mode: 'dist',
    hint: null,
    panel: null,
    selection: null,
    lesson: null,
    acOpen: false,
    acList: null,
    acQuery: '',
    gpList: null,
    gpQuery: '',
    acLoading: false,
    gpLoading: false,
    reminderAt: null,
    progress: readProgress(),
  };

  const BADGES = [
    { id: 'state', name: 'State Explorer', desc: 'Preview one state', icon: 'earth', xp: 15, goal: 1, progress: (p) => p.states },
    { id: 'lesson', name: 'Civics Reader', desc: 'Open a civics lesson', icon: 'book', xp: 20, goal: 1, progress: (p) => p.lessons },
    { id: 'district', name: 'District Scout', desc: 'Open a district sheet', icon: 'map', xp: 20, goal: 1, progress: (p) => p.districts },
    { id: 'record', name: 'Record Checker', desc: 'Open an MP or MLA record', icon: 'document-text', xp: 25, goal: 1, progress: (p) => p.records },
    { id: 'reminder', name: 'Daily Citizen', desc: 'Set a Gram Sabha reminder', icon: 'notifications', xp: 30, goal: 1, progress: (p) => p.reminders },
  ];

  const ui = {
    root: null,
    hint: null,
    hero: null,
    tabs: null,
    preview: null,
    sheet: null,
    modal: null,
    badgeToast: null,
  };

  function readProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { states: 0, lessons: 0, districts: 0, records: 0, reminders: 0, badges: [] };
  }

  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch {}
  }

  function unlockBadges() {
    const newly = [];
    for (const badge of BADGES) {
      if (state.progress.badges.includes(badge.id)) continue;
      if ((badge.progress(state.progress) || 0) >= badge.goal) {
        state.progress.badges.push(badge.id);
        newly.push(badge);
      }
    }
    if (newly.length) saveProgress();
    return newly;
  }

  function addProgress(key) {
    state.progress[key] = (state.progress[key] || 0) + 1;
    const newly = unlockBadges();
    saveProgress();
    renderBadgeToast(newly[0] || null);
    renderBadges();
  }

  function esc(v) {
    return String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function norm(s) {
    return String(s || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]+/g, '');
  }

  function byKey(map, key, fallback = null) {
    if (!map) return fallback;
    return map[norm(key)] || fallback;
  }

  function openUrl(url) {
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {}
  }

  function ensureRoot() {
    if (ui.root) return;
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'kyi-ui';
    root.innerHTML = `
      <div class="kyi-topbar">
        <button class="kyi-icon" data-action="back" aria-label="Back">‹</button>
        <div class="kyi-titlewrap">
          <div class="kyi-title">Know Your India</div>
          <div class="kyi-subtitle" data-bind="subtitle">Tap a state to begin</div>
        </div>
        <button class="kyi-icon" data-action="open-civics" aria-label="Civics">C</button>
        <button class="kyi-icon amber" data-action="open-badges" aria-label="Badges">★</button>
      </div>
      <div class="kyi-hero" data-bind="hero"></div>
      <div class="kyi-tabs" data-bind="tabs" hidden></div>
      <div class="kyi-hint" data-bind="hint" hidden></div>
      <div class="kyi-preview" data-bind="preview" hidden></div>
      <div class="kyi-sheet" data-bind="sheet" hidden></div>
      <div class="kyi-modal" data-bind="modal" hidden></div>
      <div class="kyi-toast" data-bind="toast" hidden></div>
    `;
    document.body.appendChild(root);
    const style = document.createElement('style');
    style.textContent = `
      #${ROOT_ID}{
        position:fixed; inset:0; z-index:18; pointer-events:none;
        font-family: Inter, system-ui, sans-serif;
      }
      #${ROOT_ID} .kyi-topbar{
        position:fixed; top:0; left:0; right:0; z-index:25;
        display:flex; align-items:center; gap:10px;
        padding: calc(10px + env(safe-area-inset-top)) 14px 10px;
        backdrop-filter: blur(22px);
        background: rgba(5,6,10,.62);
        border-bottom:1px solid rgba(255,255,255,.08);
        pointer-events:auto;
      }
      #${ROOT_ID} .kyi-icon{
        width:40px;height:40px;border-radius:20px;border:1px solid rgba(255,255,255,.12);
        background:rgba(18,22,38,.55); color:#fff; display:grid; place-items:center;
        font-size:20px; line-height:1; cursor:pointer;
      }
      #${ROOT_ID} .kyi-icon.amber{ color:#fbbf24; }
      #${ROOT_ID} .kyi-titlewrap{ flex:1; text-align:center; min-width:0; }
      #${ROOT_ID} .kyi-title{ color:#fff; font-weight:800; font-size:15px; }
      #${ROOT_ID} .kyi-subtitle{ color:rgba(235,238,248,.62); font-size:11.5px; margin-top:1px; }
      #${ROOT_ID} .kyi-hero,
      #${ROOT_ID} .kyi-preview{
        position:fixed; left:12px; right:12px; pointer-events:auto;
        border:1px solid rgba(255,255,255,.1);
        background:rgba(14,17,30,.9);
        border-radius:24px; overflow:hidden;
        box-shadow:0 18px 44px rgba(0,0,0,.24);
      }
      #${ROOT_ID} .kyi-hero{
        top: calc(66px + env(safe-area-inset-top));
        padding: 14px;
        background: rgba(12,16,30,.52);
        backdrop-filter: blur(20px);
      }
      #${ROOT_ID} .kyi-hero-head{ display:flex; align-items:center; gap:8px; }
      #${ROOT_ID} .kyi-hero-flag{
        width:24px; height:24px; border-radius:8px; background:#7C5CFC; display:grid; place-items:center; color:#fff; font-size:14px;
      }
      #${ROOT_ID} .kyi-hero-title{ color:#fff; font-weight:700; font-size:16px; }
      #${ROOT_ID} .kyi-hero-stats{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; margin-top:12px; }
      #${ROOT_ID} .kyi-stat{
        text-align:center; padding:10px 8px; border-radius:16px;
        border:1px solid rgba(55,224,255,.15); background:rgba(55,224,255,.07);
      }
      #${ROOT_ID} .kyi-stat b{ display:block; color:#fff; font-size:15px; }
      #${ROOT_ID} .kyi-stat span{ display:block; color:#91a4bd; font-size:10px; margin-top:3px; }
      #${ROOT_ID} .kyi-learn{
        margin-top:12px; display:flex; align-items:center; gap:8px;
        padding-top:11px; border-top:1px solid rgba(255,255,255,.09);
        color:#cdbcff; font-weight:700; font-size:12.5px; cursor:pointer;
      }
      #${ROOT_ID} .kyi-tabs{
        position:fixed; left:50%; transform:translateX(-50%);
        top: calc(238px + env(safe-area-inset-top));
        display:flex; gap:8px; pointer-events:auto;
        padding:4px; border:1px solid rgba(255,255,255,.12);
        border-radius:15px; background:rgba(16,20,34,.34); backdrop-filter:blur(18px);
      }
      #${ROOT_ID} .kyi-tab{
        border:none; color:rgba(235,238,248,.74); background:transparent;
        padding:10px 15px; border-radius:12px; cursor:pointer; font-size:12.5px; font-weight:700;
      }
      #${ROOT_ID} .kyi-tab.active{ color:#fff; background:#7C5CFC; }
      #${ROOT_ID} .kyi-hint{
        position:fixed; left:50%; transform:translateX(-50%);
        bottom:20px; padding:10px 16px; border-radius:18px;
        background:rgba(18,22,38,.74); color:#e7ecf7; border:1px solid rgba(255,255,255,.12);
        font-size:12.5px; font-weight:700; pointer-events:none;
      }
      #${ROOT_ID} .kyi-preview{ bottom: 18px; }
      #${ROOT_ID} .kyi-preview .hero{
        height: 140px; position:relative; display:flex; align-items:flex-end; overflow:hidden;
      }
      #${ROOT_ID} .kyi-preview .hero img,
      #${ROOT_ID} .kyi-preview .hero .fallback{
        position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
      }
      #${ROOT_ID} .kyi-preview .hero .overlay{
        position:absolute; inset:0;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(14,17,30,.56) 60%, rgba(14,17,30,.96) 100%);
      }
      #${ROOT_ID} .kyi-preview .hero .copy{ position:relative; padding:16px; z-index:1; }
      #${ROOT_ID} .kyi-preview .hero .name{ color:#fff; font-size:26px; font-weight:800; letter-spacing:-.5px; }
      #${ROOT_ID} .kyi-preview .hero .tagline{ color:rgba(202,192,255,.95); font-size:13px; margin-top:3px; }
      #${ROOT_ID} .kyi-preview .stats,
      #${ROOT_ID} .kyi-preview .gk{ display:flex; gap:10px; padding:14px 18px; }
      #${ROOT_ID} .kyi-preview .stat,
      #${ROOT_ID} .kyi-preview .gk .item{
        flex:1; text-align:center; border-radius:16px; padding:10px;
        background:rgba(55,224,255,.08); border:1px solid rgba(55,224,255,.16);
      }
      #${ROOT_ID} .kyi-preview .stat b,
      #${ROOT_ID} .kyi-preview .gk .val{ display:block; color:#fff; font-size:16px; font-weight:800; }
      #${ROOT_ID} .kyi-preview .stat span,
      #${ROOT_ID} .kyi-preview .gk .key{ display:block; color:#91a4bd; font-size:10px; margin-top:3px; }
      #${ROOT_ID} .kyi-preview .row{ display:flex; gap:10px; padding:0 18px 18px; }
      #${ROOT_ID} .kyi-btn{
        flex:1; border:none; border-radius:16px; padding:13px 14px; cursor:pointer;
        font-weight:800; font-size:13.5px; color:#fff; background:#7C5CFC;
      }
      #${ROOT_ID} .kyi-btn.secondary{
        background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:#e8fbff;
      }
      #${ROOT_ID} .kyi-sheet,
      #${ROOT_ID} .kyi-modal{
        position:fixed; left:0; right:0; bottom:0; z-index:30;
        background:#fff; color:#111827; border-top-left-radius:28px; border-top-right-radius:28px;
        height:80vh; transform:translateY(0); pointer-events:auto;
        box-shadow:0 -16px 40px rgba(0,0,0,.28);
      }
      #${ROOT_ID} .kyi-sheet .wrap,
      #${ROOT_ID} .kyi-modal .wrap{
        height:100%; display:flex; flex-direction:column; padding:10px 18px 16px;
      }
      #${ROOT_ID} .kyi-handle{
        width:40px; height:4.5px; border-radius:3px; background:#d1d5db; align-self:center; margin-bottom:14px;
      }
      #${ROOT_ID} .kyi-kicker{ font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:800; color:#4f46e5; }
      #${ROOT_ID} .kyi-sheet h2,
      #${ROOT_ID} .kyi-modal h2{ margin:6px 0 2px; font-size:24px; line-height:1.08; color:#0f172a; }
      #${ROOT_ID} .kyi-sub{ color:#475569; font-size:13.5px; line-height:1.5; }
      #${ROOT_ID} .kyi-scroll{ overflow:auto; padding-bottom:14px; flex:1; }
      #${ROOT_ID} .kyi-card{
        border-radius:18px; background:#f8fafc; border:1px solid #e5e7eb; padding:14px; margin-top:14px;
      }
      #${ROOT_ID} .kyi-row{
        display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #e5e7eb;
      }
      #${ROOT_ID} .kyi-row:last-child{ border-bottom:none; }
      #${ROOT_ID} .kyi-dot{ width:7px; height:7px; border-radius:50%; background:#7C5CFC; flex:0 0 auto; }
      #${ROOT_ID} .kyi-row .main{ flex:1; }
      #${ROOT_ID} .kyi-row .title{ font-size:14.5px; font-weight:800; color:#0f172a; }
      #${ROOT_ID} .kyi-row .sub{ font-size:12px; color:#64748b; margin-top:1px; }
      #${ROOT_ID} .kyi-pill-row{ display:flex; flex-wrap:wrap; gap:7px; }
      #${ROOT_ID} .kyi-pill{
        padding:8px 11px; border-radius:999px; background:rgba(55,224,255,.08);
        border:1px solid rgba(55,224,255,.18); color:#075985; font-size:12px;
      }
      #${ROOT_ID} .kyi-link{
        display:flex; align-items:center; gap:8px; margin-top:10px; padding:12px 14px;
        border-radius:16px; background:#f8fafc; border:1px solid #e5e7eb; color:#0f172a; text-decoration:none;
      }
      #${ROOT_ID} .kyi-close{
        margin-top:10px; border:none; border-radius:16px; background:#0f172a; color:#fff; font-weight:800; padding:14px 16px;
      }
      #${ROOT_ID} .kyi-list{ padding:4px 0 8px; }
      #${ROOT_ID} .kyi-search{
        display:flex; align-items:center; gap:8px; margin-top:12px; margin-bottom:6px;
        padding:0 12px; height:44px; background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px;
      }
      #${ROOT_ID} .kyi-search input{
        flex:1; border:none; background:transparent; outline:none; font-size:14.5px; color:#0f172a;
      }
      #${ROOT_ID} .kyi-badge-list{ display:grid; gap:12px; padding-top:10px; }
      #${ROOT_ID} .kyi-badge{
        display:flex; gap:12px; align-items:center; padding:12px 0; border-bottom:1px solid #e5e7eb;
      }
      #${ROOT_ID} .kyi-badge:last-child{ border-bottom:none; }
      #${ROOT_ID} .kyi-badge .icon{
        width:44px;height:44px;border-radius:14px;display:grid;place-items:center;
        background:#e0f2fe;color:#0f172a;font-weight:900;
      }
      #${ROOT_ID} .kyi-badge .meta{ flex:1; }
      #${ROOT_ID} .kyi-badge .name{ font-weight:800; color:#0f172a; }
      #${ROOT_ID} .kyi-badge .desc{ font-size:12px; color:#64748b; margin-top:2px; }
      #${ROOT_ID} .kyi-badge .xp{ font-weight:800; color:#d97706; }
      #${ROOT_ID} .kyi-bar{ height:5px; border-radius:999px; background:#e5e7eb; overflow:hidden; margin-top:8px; }
      #${ROOT_ID} .kyi-bar > div{ height:100%; background:#4f46e5; border-radius:999px; }
      #${ROOT_ID} .kyi-toast{
        position:fixed; left:16px; right:16px; bottom:24px; z-index:40;
        background:rgba(12,16,32,.95); color:#fff; border:1px solid rgba(255,255,255,.16);
        border-radius:16px; padding:13px; display:flex; gap:12px; align-items:center;
      }
      #${ROOT_ID} .kyi-toast .icon{
        width:40px;height:40px;border-radius:12px; background:#f59e0b; display:grid; place-items:center; font-weight:900;
      }
      #${ROOT_ID} .kyi-toast .title{ font-size:11px; color:#fbbf24; font-weight:800; letter-spacing:.6px; }
      #${ROOT_ID} .kyi-toast .name{ font-size:15px; font-weight:800; margin-top:1px; }
      @media (max-width: 860px){
        #${ROOT_ID} .kyi-hero{ top: calc(62px + env(safe-area-inset-top)); }
        #${ROOT_ID} .kyi-hero-stats{ grid-template-columns:repeat(2,minmax(0,1fr)); }
        #${ROOT_ID} .kyi-tabs{ top: calc(248px + env(safe-area-inset-top)); }
        #${ROOT_ID} .kyi-preview .stats, #${ROOT_ID} .kyi-preview .gk{ flex-direction:column; }
        #${ROOT_ID} .kyi-preview .row{ flex-direction:column; }
      }
    `;
    document.head.appendChild(style);
    ui.root = root;
    ui.hint = root.querySelector('[data-bind="hint"]');
    ui.hero = root.querySelector('[data-bind="hero"]');
    ui.tabs = root.querySelector('[data-bind="tabs"]');
    ui.preview = root.querySelector('[data-bind="preview"]');
    ui.sheet = root.querySelector('[data-bind="sheet"]');
    ui.modal = root.querySelector('[data-bind="modal"]');
    ui.badgeToast = root.querySelector('[data-bind="toast"]');
    root.addEventListener('click', onRootClick);
    root.addEventListener('input', onRootInput);
  }

  async function loadData() {
    try {
      const [meta, gk, lessons, mp, mla] = await Promise.all([
        fetch('/assets/data/states_meta.json').then((r) => r.json()),
        fetch('/assets/data/states_gk.json').then((r) => r.json()),
        fetch('/assets/data/civics_lessons.json').then((r) => r.json()),
        fetch('/assets/data/mp_2024.json').then((r) => r.json()),
        fetch('/assets/data/mla_2026.json').then((r) => r.json()),
      ]);
      DATA.meta = meta;
      DATA.gk = gk;
      DATA.lessons = lessons;
      DATA.mp = mp;
      DATA.mla = mla;
    } catch (err) {
      console.warn('Know Your India data load failed', err);
    }
  }

  function stateMeta(name) { return byKey(DATA.meta, name, null); }
  function stateGk(name) { return byKey(DATA.gk, name, null); }
  function mpFor(state, pc) { return DATA.mp?.[`${norm(state)}::${norm(pc)}`] || null; }
  function mlaFor(state, ac) { return DATA.mla?.[`${norm(state)}::${norm(ac)}`] || null; }

  let heroCache = {};
  async function loadHeroImg(state) {
    const k = norm(state);
    if (Object.prototype.hasOwnProperty.call(heroCache, k)) return heroCache[k];
    try {
      const title = encodeURIComponent(String(state).replace(/&/g, 'and'));
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      const j = await r.json();
      const url = j.originalimage?.source || j.thumbnail?.source || null;
      heroCache[k] = url;
      return url;
    } catch {
      heroCache[k] = null;
      return null;
    }
  }

  function currentLessons(state) {
    const base = DATA.lessons || [];
    if (!state) return base;
    const mk = stateMeta(state);
    const gk = stateGk(state);
    const dynamic = {
      id: `state_${norm(state)}`,
      title: `${state} civics snapshot`,
      icon: 'earth',
      color: '#4F46E5',
      blurb: `Quick civics notes for ${state}.`,
      sections: [
        { head: 'What to know', body: `${state} is part of India\'s federal system. ${mk ? `It has ${mk.districts} districts, ${mk.assembly || '—'} assembly seats and ${mk.lokSabha} Lok Sabha seats.` : ''}` },
        { head: 'Exam focus', body: gk ? `${gk.capital} is the capital, ${gk.language} is the language, and it was formed in ${gk.formed}.` : 'Focus on state capital, language, formation year and district map.' },
        { head: 'How to revise', body: 'Link the state to district administration, local government, elections and major public institutions.' },
      ],
    };
    return [dynamic, ...base];
  }

  function currentBadges() {
    const p = state.progress;
    return BADGES.map((b) => {
      const cur = b.progress(p) || 0;
      const done = p.badges.includes(b.id);
      return { ...b, cur, done, pct: Math.min(100, Math.round((cur / b.goal) * 100)) };
    });
  }

  function renderHero() {
    const showPreview = !!state.previewing;
    const meta = state.previewing ? stateMeta(state.previewing) : null;
    const gk = state.previewing ? stateGk(state.previewing) : null;
    if (!showPreview) {
      ui.hero.hidden = false;
      ui.hero.innerHTML = `
        <div class="kyi-hero-head"><div class="kyi-hero-flag">🌏</div><div class="kyi-hero-title">India</div></div>
        <div class="kyi-hero-stats">
          <div class="kyi-stat"><b>1.43B+</b><span>Population</span></div>
          <div class="kyi-stat"><b>28</b><span>States</span></div>
          <div class="kyi-stat"><b>8</b><span>UTs</span></div>
          <div class="kyi-stat"><b>785+</b><span>Districts</span></div>
        </div>
        <div class="kyi-learn" data-action="open-civics">Learn how India is governed</div>
      `;
      ui.preview.hidden = true;
      return;
    }
    ui.hero.hidden = true;
    const stats = meta ? `
      <div class="stats">
        <div class="stat"><b>${meta.districts}</b><span>Districts</span></div>
        <div class="stat"><b>${meta.assembly || '—'}</b><span>Assembly</span></div>
        <div class="stat"><b>${meta.lokSabha}</b><span>Lok Sabha</span></div>
        <div class="stat"><b>${meta.population}</b><span>People</span></div>
      </div>` : '';
    const gkStrip = gk ? `
      <div class="gk">
        <div class="item"><div class="val">${esc(gk.capital)}</div><div class="key">Capital</div></div>
        <div class="item"><div class="val">${esc(gk.language)}</div><div class="key">Language</div></div>
        <div class="item"><div class="val">${esc(gk.formed)}</div><div class="key">Formed</div></div>
      </div>` : '';
    const title = meta?.state || state.previewing;
    const tagline = meta?.tagline || 'State snapshot';
    const img = state.heroImg ? `<img src="${esc(state.heroImg)}" alt="${esc(title)}">` : `<div class="fallback" style="background: linear-gradient(135deg,#4f46e5,#0ea5e9)"></div>`;
    ui.preview.hidden = false;
    ui.preview.innerHTML = `
      <div class="hero">
        ${img}
        <div class="overlay"></div>
        <div class="copy">
          <div class="name">${esc(title)}</div>
          <div class="tagline">${esc(tagline)}</div>
        </div>
      </div>
      ${stats}
      ${gkStrip}
      <div class="row">
        <button class="kyi-btn secondary" data-action="open-gk">Facts & GK</button>
        <button class="kyi-btn secondary" data-action="open-civics">Civics lessons</button>
      </div>
      <div class="row">
        <button class="kyi-btn" data-action="explore">Explore</button>
        <button class="kyi-btn secondary" data-action="open-badges">Badges</button>
      </div>
    `;
  }

  function renderTabs() {
    if (!state.activeState || state.previewing) {
      ui.tabs.hidden = true;
      ui.tabs.innerHTML = '';
      return;
    }
    ui.tabs.hidden = false;
    ui.tabs.innerHTML = `
      <button class="kyi-tab ${state.mode === 'dist' ? 'active' : ''}" data-action="set-mode" data-mode="dist">Districts</button>
      <button class="kyi-tab ${state.mode === 'ac' ? 'active' : ''}" data-action="set-mode" data-mode="ac">Assembly</button>
      <button class="kyi-tab ${state.mode === 'pc' ? 'active' : ''}" data-action="set-mode" data-mode="pc">Lok Sabha</button>
    `;
  }

  function renderHint() {
    if (!state.hint) {
      ui.hint.hidden = true;
      ui.hint.textContent = '';
      return;
    }
    ui.hint.hidden = false;
    ui.hint.textContent = state.hint;
  }

  function renderBadgeToast(badge) {
    if (!badge) {
      ui.badgeToast.hidden = true;
      ui.badgeToast.innerHTML = '';
      return;
    }
    ui.badgeToast.hidden = false;
    ui.badgeToast.innerHTML = `
      <div class="icon">★</div>
      <div style="flex:1">
        <div class="title">Badge unlocked · +${badge.xp} XP</div>
        <div class="name">${esc(badge.name)}</div>
      </div>
    `;
    clearTimeout(renderBadgeToast._t);
    renderBadgeToast._t = setTimeout(() => { ui.badgeToast.hidden = true; }, 3200);
  }

  function renderSheet() {
    if (!state.panel) {
      ui.sheet.hidden = true;
      ui.sheet.innerHTML = '';
      return;
    }
    ui.sheet.hidden = false;
    const closeBtn = `<button class="kyi-close" data-action="close-panel">Done</button>`;
    if (state.panel === 'gk') {
      const mk = state.previewing ? stateMeta(state.previewing) : null;
      const gk = state.previewing ? stateGk(state.previewing) : null;
      ui.sheet.innerHTML = `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <div class="kyi-kicker">STATE · GENERAL KNOWLEDGE</div>
          <h2>${esc(state.previewing || 'India')}</h2>
          <div class="kyi-sub">${esc(mk?.tagline || 'State facts and exam notes')}</div>
          <div class="kyi-scroll">
            ${gk ? `
              <div class="kyi-card">
                <div class="kyi-row"><div class="main"><div class="title">Capital</div><div class="sub">${esc(gk.capital)}</div></div></div>
                <div class="kyi-row"><div class="main"><div class="title">Official language</div><div class="sub">${esc(gk.language)}</div></div></div>
                <div class="kyi-row"><div class="main"><div class="title">Formed</div><div class="sub">${esc(gk.formed)}</div></div></div>
                ${mk ? `<div class="kyi-row"><div class="main"><div class="title">Districts</div><div class="sub">${esc(mk.districts)}</div></div></div>` : ''}
                ${mk ? `<div class="kyi-row"><div class="main"><div class="title">Assembly · Lok Sabha</div><div class="sub">${esc(mk.assembly || '—')} · ${esc(mk.lokSabha)}</div></div></div>` : ''}
              </div>` : ''
            }
            <div class="kyi-card">
              <div class="kyi-kicker">Exam facts</div>
              ${(gk?.facts || []).map((f) => `<div class="kyi-row"><div class="kyi-dot"></div><div class="main"><div class="sub">${esc(f)}</div></div></div>`).join('')}
              <a class="kyi-link" href="javascript:void(0)" data-action="open-civics-inline">Learn the civics behind it</a>
            </div>
          </div>
          ${closeBtn}
        </div>
      `;
      return;
    }
    if (state.panel === 'civics') {
      const lessons = currentLessons(state.previewing || state.activeState);
      ui.sheet.innerHTML = `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <div class="kyi-kicker">CIVICS · LEARN</div>
          <h2>Civics lessons</h2>
          <div class="kyi-sub">${state.previewing || state.activeState ? `Tailored for ${esc(state.previewing || state.activeState)}, plus the basics` : 'Short, exam-aligned modules on how India works'}</div>
          <div class="kyi-scroll">
            ${(lessons || []).map((l) => `
              <div class="kyi-card">
                <div class="kyi-row" style="padding-top:0;border-bottom:none">
                  <div class="main">
                    <div class="title">${esc(l.title)}</div>
                    <div class="sub">${esc(l.blurb)}</div>
                  </div>
                  <button class="kyi-btn secondary" style="flex:0 0 auto;padding:10px 12px" data-action="open-lesson" data-lesson="${esc(l.id)}">Open</button>
                </div>
              </div>
            `).join('')}
          </div>
          ${closeBtn}
        </div>
      `;
      return;
    }
    if (state.panel === 'lesson') {
      const lesson = state.lesson;
      ui.sheet.innerHTML = `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <button class="kyi-link" data-action="back-to-civics" style="margin-top:0">‹ Civics lessons</button>
          <div class="kyi-kicker">CIVICS</div>
          <h2>${esc(lesson?.title || '')}</h2>
          <div class="kyi-sub">${esc(lesson?.blurb || '')}</div>
          <div class="kyi-scroll">
            ${(lesson?.sections || []).map((s) => `
              <div class="kyi-card">
                <div class="kyi-kicker">${esc(s.head)}</div>
                <div style="margin-top:8px;color:#334155;line-height:1.65;font-size:14px">${esc(s.body)}</div>
              </div>
            `).join('')}
            <div class="kyi-card" style="text-align:center;color:#64748b;font-size:11.5px;line-height:1.6;margin-top:14px">
              Reading civics lessons earns XP toward your Constitution Scholar badge.
            </div>
          </div>
          ${closeBtn}
        </div>
      `;
      return;
    }
    if (state.panel === 'badges') {
      const badges = currentBadges();
      const earned = badges.filter((b) => b.done).reduce((a, b) => a + b.xp, 0);
      ui.sheet.innerHTML = `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <div class="kyi-kicker">CIVIC BADGES</div>
          <h2>Your civic journey</h2>
          <div class="kyi-sub">${state.progress.badges.length}/${BADGES.length} unlocked · ${earned} XP earned</div>
          <div class="kyi-scroll">
            <div class="kyi-badge-list">
              ${badges.map((b) => `
                <div class="kyi-badge">
                  <div class="icon">${b.done ? '✓' : '•'}</div>
                  <div class="meta">
                    <div class="name">${esc(b.name)}${b.done ? ' ✓' : ''}</div>
                    <div class="desc">${esc(b.desc)}</div>
                    <div class="kyi-bar"><div style="width:${b.pct}%"></div></div>
                  </div>
                  <div class="xp">+${b.xp}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ${closeBtn}
        </div>
      `;
      return;
    }
    if (state.panel === 'selection') {
      ui.sheet.innerHTML = renderSelection();
      return;
    }
    if (state.panel === 'ac-list') {
      ui.sheet.innerHTML = renderAssemblyList();
      return;
    }
    ui.sheet.hidden = true;
  }

  function renderSelection() {
    const sel = state.selection || {};
    if (sel.kind === 'dist') {
      const list = filteredGp();
      return `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <div class="kyi-kicker">DISTRICT</div>
          <h2>${esc(sel.district || '')}</h2>
          <div class="kyi-sub">${esc(sel.state || '')}${state.gpList ? ` · ${state.gpList.length} gram panchayats` : ''}</div>
          <div class="kyi-search">
            <span>⌕</span>
            <input data-search="gp" value="${esc(state.gpQuery)}" placeholder="Search your panchayat…" />
          </div>
          <div class="kyi-scroll">
            ${state.gpLoading ? `<div class="kyi-card" style="text-align:center;color:#64748b">Fetching panchayats…</div>` :
              (list.length ? list.map((g) => `
                <div class="kyi-row" data-action="pick-gp" data-gp="${esc(g.gp_code)}">
                  <div class="kyi-dot"></div>
                  <div class="main"><div class="title">${esc(g.gp_name)}</div><div class="sub">${esc(g.block_name)} block</div></div>
                  <div style="color:#64748b">›</div>
                </div>
              `).join('') : `<div class="kyi-card" style="text-align:center;color:#64748b">No panchayat matches.</div>`)}
          </div>
          <button class="kyi-close" data-action="close-panel">Done</button>
        </div>
      `;
    }
    if (sel.kind === 'gp') {
      return `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <button class="kyi-link" data-action="back-to-district">‹ ${esc(sel.district || '')}</button>
          <div class="kyi-kicker">GRAM PANCHAYAT</div>
          <h2>${esc(sel.gp?.gp_name || '')}</h2>
          <div class="kyi-sub">${esc(sel.gp?.block_name || '')} block · ${esc(sel.district || '')}, ${esc(sel.state || '')}</div>
          <div class="kyi-scroll">
            <div class="kyi-card">
              <div class="kyi-kicker">What your gram panchayat does</div>
              ${[
                'Runs village water supply, sanitation, drains, streetlights and local roads.',
                'Led by an elected Sarpanch and Ward Members every 5 years.',
                'Gram Sabha — every adult voter in the village — approves plans and budgets.',
                'Funds come from Finance Commission grants and local taxes.',
              ].map((f) => `<div class="kyi-row"><div class="kyi-dot"></div><div class="main"><div class="sub">${esc(f)}</div></div></div>`).join('')}
              <button class="kyi-btn secondary" style="margin-top:10px" data-action="open-lesson-id" data-lesson-id="amendment-73-74">Full lesson: 73rd Amendment & your local power</button>
            </div>
            <div class="kyi-card">
              <div class="kyi-kicker">Official identity</div>
              <div class="kyi-row"><div class="main"><div class="title">LGD code</div><div class="sub">${esc(sel.gp?.gp_code || '')}</div></div></div>
              <div class="kyi-row"><div class="main"><div class="title">Block</div><div class="sub">${esc(sel.gp?.block_name || '')}</div></div></div>
              <div class="kyi-row"><div class="main"><div class="title">District</div><div class="sub">${esc(sel.district || '')}</div></div></div>
            </div>
            <a class="kyi-link" href="https://egramswaraj.gov.in/knowYourPanchayat.do" target="_blank" rel="noopener noreferrer">Official profile (eGramSwaraj)</a>
            <a class="kyi-link" href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer">Report a local issue</a>
          </div>
          <button class="kyi-close" data-action="close-panel">Done</button>
        </div>
      `;
    }
    if (sel.kind === 'pc' || sel.kind === 'ac') {
      const isAc = sel.kind === 'ac';
      const rep = isAc ? mlaFor(sel.state, sel.ac) : mpFor(sel.state, sel.pc);
      return `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <button class="kyi-link" data-action="back-to-district">${esc(sel.district || sel.state || '')}</button>
          <div class="kyi-kicker">${isAc ? 'ASSEMBLY · MLA' : 'LOK SABHA · MP'}</div>
          <h2>${esc(isAc ? sel.ac : sel.pc)}</h2>
          <div class="kyi-sub">${esc(sel.district ? `${sel.district} · ` : '')}${esc(sel.state || '')}</div>
          <div class="kyi-scroll">
            ${rep ? `
              <div class="kyi-card">
                <div class="kyi-row" style="align-items:flex-start">
                  <div class="kyi-dot"></div>
                  <div class="main">
                    <div class="title">Your ${isAc ? 'MLA' : 'MP'} · elected ${isAc ? '2026' : '2024'}</div>
                    <div class="sub" style="font-size:16px;color:#0f172a;font-weight:800;margin-top:4px">${esc(isAc ? rep.winner : rep.mp)}</div>
                    <div class="kyi-pill-row" style="margin-top:10px"><span class="kyi-pill">${esc(rep.abbr || '')}</span><span class="kyi-pill">${esc(rep.party || '')}</span></div>
                    ${rep.margin ? `<div class="sub" style="margin-top:10px">Won by ${esc(rep.margin)} votes</div>` : ''}
                  </div>
                </div>
                <a class="kyi-link" href="${isAc ? `https://www.google.com/search?q=${encodeURIComponent(`${rep.winner} ${sel.state} MLA site:myneta.info`)}` : `https://www.google.com/search?q=${encodeURIComponent(`${rep.mp} ${sel.state} MP site:myneta.info`)}`}" target="_blank" rel="noopener noreferrer">See their record on MyNeta →</a>
              </div>
            ` : `
              <a class="kyi-link" href="${isAc ? 'https://myneta.info' : 'https://sansad.in/ls'}" target="_blank" rel="noopener noreferrer">Open the official directory / MyNeta</a>
            `}
            ${isAc && sel.parentPc ? `<div class="kyi-card"><div class="kyi-row"><div class="kyi-dot"></div><div class="main"><div class="sub">Part of <b>${esc(sel.parentPc)}</b> Lok Sabha seat</div></div></div></div>` : ''}
            <div class="kyi-card">
              <div class="kyi-kicker">${isAc ? 'WHAT YOUR MLA DOES' : 'WHAT YOUR MP DOES'}</div>
              ${(isAc ? [
                'Makes state laws and approves the State Budget in the Vidhan Sabha.',
                'Handles state subjects such as police, roads, schools, health and water.',
                'MLAs elect the Chief Minister and serve a 5-year term.',
                'Represents your assembly constituency.',
              ] : [
                'Makes national laws and approves the Union Budget in the Lok Sabha.',
                'Questions the central government and represents your constituency.',
                'Gets MPLADS funds for local development works.',
                'Serves a 5-year term.',
              ]).map((f) => `<div class="kyi-row"><div class="kyi-dot"></div><div class="main"><div class="sub">${esc(f)}</div></div></div>`).join('')}
              <button class="kyi-btn secondary" style="margin-top:10px" data-action="open-lesson-id" data-lesson-id="mp-mla-ward">Full lesson: MP vs MLA vs Ward Member</button>
            </div>
            <a class="kyi-link" href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">Voter services</a>
          </div>
          <button class="kyi-close" data-action="close-panel">Done</button>
        </div>
      `;
    }
    return '';
  }

  function filteredGp() {
    const q = String(state.gpQuery || '').trim().toLowerCase();
    const list = state.gpList || [];
    return q ? list.filter((g) => g.gp_name.toLowerCase().includes(q) || g.block_name.toLowerCase().includes(q)) : list;
  }

  function renderAssemblyList() {
    const list = filteredAc();
    return `
      <div class="wrap">
        <div class="kyi-handle"></div>
        <div class="kyi-kicker">ASSEMBLY · MLA</div>
        <h2>${esc(state.activeState || '')}</h2>
        <div class="kyi-sub">${state.acList ? `${state.acList.length} assembly seats` : 'Loading…'}</div>
        <div class="kyi-search">
          <span>⌕</span>
          <input data-search="ac" value="${esc(state.acQuery)}" placeholder="Search your constituency…" />
        </div>
        <div class="kyi-scroll">
          ${state.acLoading ? `<div class="kyi-card" style="text-align:center;color:#64748b">Fetching seats…</div>` :
            (state.acList && state.acList.length === 0 ? `<div class="kyi-card" style="text-align:center;color:#64748b">Assembly seats unavailable for this state.</div>` :
              list.map((a) => {
                const m = state.activeState ? mlaFor(state.activeState, a.ac) : null;
                return `
                  <div class="kyi-row" data-action="pick-ac" data-ac="${esc(a.ac)}" data-district="${esc(a.district)}" data-pc="${esc(a.pc)}">
                    <div class="kyi-dot"></div>
                    <div class="main"><div class="title">${esc(a.ac)}</div><div class="sub">${esc(m ? m.winner : (a.district ? `${a.district} district` : 'Tap for details'))}</div></div>
                    <div style="color:#64748b">${m ? m.abbr : '›'}</div>
                  </div>
                `;
              }).join(''))
          }
        </div>
        <button class="kyi-close" data-action="close-panel">Done</button>
      </div>
    `;
  }

  function filteredAc() {
    const q = String(state.acQuery || '').trim().toLowerCase();
    const list = state.acList || [];
    return q ? list.filter((a) => a.ac.toLowerCase().includes(q) || a.district.toLowerCase().includes(q)) : list;
  }

  function renderModal() {
    if (!state.lesson && !state.acOpen) {
      ui.modal.hidden = true;
      ui.modal.innerHTML = '';
      return;
    }
    ui.modal.hidden = false;
    if (state.lesson) {
      ui.modal.innerHTML = `
        <div class="wrap">
          <div class="kyi-handle"></div>
          <button class="kyi-link" data-action="back-to-civics">‹ Civics lessons</button>
          <div class="kyi-kicker">CIVICS</div>
          <h2>${esc(state.lesson.title)}</h2>
          <div class="kyi-sub">${esc(state.lesson.blurb)}</div>
          <div class="kyi-scroll">
            ${(state.lesson.sections || []).map((s) => `
              <div class="kyi-card">
                <div class="kyi-kicker">${esc(s.head)}</div>
                <div style="margin-top:8px;color:#334155;line-height:1.65;font-size:14px">${esc(s.body)}</div>
              </div>
            `).join('')}
            <div class="kyi-card" style="text-align:center;color:#64748b;font-size:11.5px;line-height:1.6;margin-top:14px">
              Reading civics lessons earns XP toward your Constitution Scholar badge.
            </div>
          </div>
          <button class="kyi-close" data-action="close-lesson">Done</button>
        </div>
      `;
      return;
    }
    if (state.acOpen) {
      ui.modal.innerHTML = renderAssemblyList();
      return;
    }
    ui.modal.hidden = true;
    ui.modal.innerHTML = '';
  }

  function renderBadges() {
    const badgeWrap = ui.root?.querySelector('[data-bind="badge-sheet"]');
    if (!badgeWrap) return;
  }

  function renderState() {
    renderHero();
    renderTabs();
    renderHint();
    renderSheet();
    renderModal();
  }

  function renderBadgeSheet() {
    const wrap = document.querySelector('[data-bind="badge-sheet"]');
    if (!wrap) return;
  }

  function renderBadgeToast(badge) {
    if (!badge) {
      ui.badgeToast.hidden = true;
      ui.badgeToast.innerHTML = '';
      return;
    }
    ui.badgeToast.hidden = false;
    ui.badgeToast.innerHTML = `
      <div class="icon">★</div>
      <div style="flex:1">
        <div class="title">Badge unlocked · +${badge.xp} XP</div>
        <div class="name">${esc(badge.name)}</div>
      </div>
    `;
    clearTimeout(renderBadgeToast._timer);
    renderBadgeToast._timer = setTimeout(() => { ui.badgeToast.hidden = true; }, 3300);
  }

  function openSheet(type) {
    state.panel = type;
    if (type !== 'lesson') state.lesson = null;
    state.acOpen = false;
    renderState();
  }

  function openLessonById(id) {
    const lessons = currentLessons(state.previewing || state.activeState);
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;
    state.lesson = lesson;
    state.panel = null;
    addProgress('lessons');
    renderState();
  }

  function openCivics() {
    state.panel = 'civics';
    state.lesson = null;
    state.acOpen = false;
    renderState();
  }

  function openBadges() {
    state.panel = 'badges';
    state.lesson = null;
    state.acOpen = false;
    renderState();
  }

  function openIndia() {
    state.panel = null;
    state.lesson = null;
    state.selection = null;
    state.previewing = null;
    state.activeState = null;
    state.hint = null;
    state.mode = 'dist';
    state.acOpen = false;
    renderState();
  }

  function setPreview(stateName) {
    state.previewing = stateName;
    state.activeState = stateName;
    state.panel = null;
    state.lesson = null;
    state.selection = null;
    state.hint = null;
    state.acOpen = false;
    state.heroImg = null;
    addProgress('states');
    loadHeroImg(stateName).then((img) => {
      if (state.previewing === stateName) state.heroImg = img;
      renderState();
    });
    renderState();
  }

  function stateSelected(stateName) {
    state.activeState = stateName;
    state.previewing = null;
    state.panel = null;
    state.lesson = null;
    state.hint = null;
    state.acOpen = false;
    renderState();
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === 'ac') {
      state.panel = null;
      state.lesson = null;
      state.acOpen = true;
      if (state.activeState) loadAssemblyList(state.activeState);
    } else {
      state.acOpen = false;
    }
    renderState();
    if (window.__kyi && typeof window.__kyi.setMode === 'function') {
      window.__kyi.setMode(mode);
    }
  }

  function setHint(text) {
    state.hint = text || null;
    renderState();
  }

  function clearSelection() {
    state.selection = null;
    state.panel = null;
    state.acOpen = false;
    renderState();
  }

  function openSelection(kind, payload) {
    state.selection = { kind, ...payload };
    state.panel = 'selection';
    state.acOpen = false;
    if (kind === 'dist') addProgress('districts');
    if (kind === 'gp') addProgress('records');
    if (kind === 'pc' || kind === 'ac') addProgress('records');
    renderState();
  }

  async function loadAssemblyList(stateName) {
    state.acOpen = true;
    state.acQuery = '';
    state.acLoading = true;
    state.acList = null;
    renderState();
    try {
      const key = stateKey(stateName);
      const r = await fetch(`https://cdn.jsdelivr.net/gh/HindustanTimesLabs/shapefiles@master/state_ut/${key}/assembly/${key}_AC.json`);
      const j = await r.json();
      const seen = new Set();
      const list = [];
      for (const f of (j.features || [])) {
        const p = f.properties || {};
        const ac = p.AC_NAME;
        if (!ac || seen.has(ac)) continue;
        seen.add(ac);
        list.push({ ac, district: p.DIST_NAME || '', pc: p.PC_NAME || '' });
      }
      list.sort((a, b) => a.ac.localeCompare(b.ac));
      state.acList = list;
    } catch {
      state.acList = [];
    } finally {
      state.acLoading = false;
      renderState();
    }
  }

  const stateKey = (name) => {
    const k = String(name || '').toLowerCase().replace(/&/g, '').replace(/\band\b/g, '').replace(/[^a-z]/g, '');
    const ov = {
      jammuandkashmir: 'jammukashmir',
      nctofdelhi: 'delhi',
      orissa: 'odisha',
      pondicherry: 'puducherry',
      uttaranchal: 'uttarakhand',
      dadraandnagarhavelianddamananddiu: 'dadranagarhaveli',
    };
    return ov[k] || k;
  };

  async function loadPanchayats(district, stateName) {
    state.gpLoading = true;
    state.gpList = null;
    state.gpQuery = '';
    renderState();
    try {
      const CKAN = 'https://ckandev.indiadataportal.com/api/3/action';
      const RES = 'f49a01ad-180b-4a54-8ecf-0494769d26fa';
      const ckanSql = async (sql) => {
        const r = await fetch(`${CKAN}/datastore_search_sql?sql=${encodeURIComponent(sql)}`);
        const j = await r.json();
        if (!j.success) throw new Error('ckan');
        return j.result.records;
      };
      const resolveState = async (stNm) => {
        const rows = await ckanSql(`SELECT DISTINCT state_name FROM "${RES}"`);
        const list = rows.map((r) => r.state_name);
        return bestMatch(stNm, list);
      };
      const resolveDistrict = async (ckState, d) => {
        const rows = await ckanSql(`SELECT DISTINCT district_name FROM "${RES}" WHERE state_name='${String(ckState).replace(/'/g, "''")}'`);
        const list = rows.map((r) => r.district_name);
        return bestMatch(d, list);
      };
      const ckState = await resolveState(stateName);
      if (!ckState) throw new Error('state');
      const ckDist = await resolveDistrict(ckState, district);
      if (!ckDist) throw new Error('dist');
      const filters = encodeURIComponent(JSON.stringify({ state_name: ckState, district_name: ckDist }));
      const r = await fetch(`${CKAN}/datastore_search?resource_id=${RES}&limit=5000&filters=${filters}`);
      const j = await r.json();
      const recs = (j.result?.records || []).map((x) => ({ gp_name: x.gp_name, gp_code: x.gp_code, block_name: x.block_name }));
      recs.sort((a, b) => a.gp_name.localeCompare(b.gp_name));
      state.gpList = recs;
    } catch {
      state.gpList = [];
    } finally {
      state.gpLoading = false;
      renderState();
    }
  }

  function bestMatch(target, options) {
    const t = norm(target);
    const exact = options.find((o) => norm(o) === t);
    if (exact) return exact;
    let best = null, bd = 99;
    for (const o of options) {
      const d = lev(t, norm(o));
      if (d < bd) { bd = d; best = o; }
    }
    return bd <= 3 ? best : null;
  }

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        );
      }
    }
    return d[m][n];
  }

  function loadMoreCivicsFromState(stateName) {
    if (!stateName) return currentLessons(null);
    return currentLessons(stateName);
  }

  function onRootClick(ev) {
    const el = ev.target.closest('[data-action]');
    if (!el || !ui.root.contains(el)) return;
    const action = el.getAttribute('data-action');
    if (action === 'open-civics' || action === 'open-civics-inline') {
      openCivics();
      addProgress('lessons');
      return;
    }
    if (action === 'open-badges') return openBadges();
    if (action === 'open-gk') return openSheet('gk');
    if (action === 'open-lesson') return openLessonById(el.getAttribute('data-lesson'));
    if (action === 'open-lesson-id') return openLessonById(el.getAttribute('data-lesson-id'));
    if (action === 'back-to-civics') return openCivics();
    if (action === 'back-to-district') return state.selection?.kind === 'gp' ? openSelection('dist', { district: state.selection.district, state: state.selection.state }) : openSheet('selection');
    if (action === 'close-panel') { state.panel = null; state.acOpen = false; renderState(); return; }
    if (action === 'close-lesson') { state.lesson = null; state.panel = 'civics'; renderState(); return; }
    if (action === 'explore') {
      if (window.__kyi && typeof window.__kyi.explore === 'function') window.__kyi.explore();
      return;
    }
    if (action === 'back') {
      if (state.activeState) {
        state.activeState = null;
        state.previewing = null;
        state.panel = null;
        state.lesson = null;
        state.selection = null;
        state.acOpen = false;
        if (window.__kyi && typeof window.__kyi.back === 'function') window.__kyi.back();
        renderState();
      } else {
        try { window.location.href = '/'; } catch {}
      }
      return;
    }
    if (action === 'set-mode') {
      const mode = el.getAttribute('data-mode');
      state.mode = mode;
      if (window.__kyi && typeof window.__kyi.setMode === 'function') window.__kyi.setMode(mode);
      if (mode === 'ac' && state.activeState) loadAssemblyList(state.activeState);
      renderState();
      return;
    }
    if (action === 'pick-gp') {
      const gpCode = el.getAttribute('data-gp');
      const gp = (state.gpList || []).find((g) => g.gp_code === gpCode);
      if (!gp) return;
      state.selection = { kind: 'gp', gp, district: state.selection?.district || '', state: state.selection?.state || state.activeState || '' };
      state.panel = 'selection';
      addProgress('records');
      renderState();
      return;
    }
    if (action === 'pick-ac') {
      const ac = el.getAttribute('data-ac');
      const district = el.getAttribute('data-district') || '';
      const pc = el.getAttribute('data-pc') || '';
      state.selection = { kind: 'ac', ac, district, parentPc: pc, state: state.activeState || '' };
      state.panel = 'selection';
      addProgress('records');
      renderState();
      return;
    }
  }

  function onRootInput(ev) {
    const input = ev.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.dataset.search === 'gp') {
      state.gpQuery = input.value;
      renderState();
      return;
    }
    if (input.dataset.search === 'ac') {
      state.acQuery = input.value;
      renderState();
      return;
    }
  }

  function bestMatchSummary(stateName) {
    const mk = stateMeta(stateName);
    const gk = stateGk(stateName);
    return {
      state: mk?.state || stateName,
      tagline: mk?.tagline || 'State snapshot',
      districts: mk?.districts || '—',
      assembly: mk?.assembly || '—',
      lokSabha: mk?.lokSabha || '—',
      population: mk?.population || '—',
      capital: gk?.capital || '—',
      language: gk?.language || '—',
      formed: gk?.formed || '—',
      facts: gk?.facts || [],
    };
  }

  function updateFromBridge(kind, value) {
    if (kind === 'ready') {
      state.ready = true;
      renderState();
    } else if (kind === 'india') {
      openIndia();
    } else if (kind === 'statePreview') {
      state.activeState = value;
      state.previewing = value;
      state.panel = null;
      state.lesson = null;
      state.selection = null;
      state.heroImg = null;
      state.hint = null;
      addProgress('states');
      loadHeroImg(value).then((img) => {
        if (state.previewing === value) state.heroImg = img;
        renderState();
      });
      renderState();
    } else if (kind === 'stateSelected') {
      state.activeState = value;
      state.previewing = null;
      state.panel = null;
      state.lesson = null;
      state.hint = null;
      renderState();
    } else if (kind === 'hint') {
      setHint(value);
    } else if (kind === 'mode') {
      state.mode = value;
      renderState();
    } else if (kind === 'district') {
      state.selection = { kind: 'dist', district: value.district, state: value.state };
      state.panel = 'selection';
      addProgress('districts');
      loadPanchayats(value.district, value.state);
    } else if (kind === 'pc') {
      state.selection = { kind: 'pc', pc: value.pc, state: value.state };
      state.panel = 'selection';
      addProgress('records');
      renderState();
    } else if (kind === 'ac') {
      state.selection = { kind: 'ac', ac: value.ac, district: value.district, parentPc: value.parentPc, state: value.state };
      state.panel = 'selection';
      addProgress('records');
      renderState();
    } else if (kind === 'acLoading') {
      setHint('Loading assembly seats…');
    } else if (kind === 'acReady') {
      setHint(null);
    } else if (kind === 'acError') {
      setHint(`Assembly map unavailable for ${value}`);
    } else if (kind === 'pcLoading') {
      setHint('Loading Lok Sabha seats…');
    }
  }

  function initBridge() {
    window.__kyiBridge = {
      indiaReady: () => updateFromBridge('ready'),
      indiaView: () => updateFromBridge('india'),
      statePreview: (stateName) => updateFromBridge('statePreview', stateName),
      stateSelected: (stateName) => updateFromBridge('stateSelected', stateName),
      hint: (text) => updateFromBridge('hint', text),
      mode: (mode) => updateFromBridge('mode', mode),
      district: (payload) => updateFromBridge('district', payload),
      pc: (payload) => updateFromBridge('pc', payload),
      ac: (payload) => updateFromBridge('ac', payload),
      acLoading: () => updateFromBridge('acLoading'),
      acReady: () => updateFromBridge('acReady'),
      acError: (payload) => updateFromBridge('acError', payload?.state || ''),
      pcLoading: () => updateFromBridge('pcLoading'),
    };
  }

  function maybeExposeCompat() {
    window.__kyiApp = {
      setReady: () => updateFromBridge('ready'),
      setIndia: () => updateFromBridge('india'),
      setPreview: (s) => updateFromBridge('statePreview', s),
      setSelected: (s) => updateFromBridge('stateSelected', s),
      setHint: (t) => updateFromBridge('hint', t),
      setMode: (m) => updateFromBridge('mode', m),
      openDistrict: (payload) => updateFromBridge('district', payload),
      openPc: (payload) => updateFromBridge('pc', payload),
      openAc: (payload) => updateFromBridge('ac', payload),
    };
  }

  async function boot() {
    ensureRoot();
    initBridge();
    maybeExposeCompat();
    await loadData();
    state.ready = true;
    renderState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
