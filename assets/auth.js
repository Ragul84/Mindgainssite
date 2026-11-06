/* ============================================================================================
   MindGains — shared auth (Supabase, Google OAuth).

   One client, one callback URL, one account chip, used by every page. Before this, sign-in
   lived only inside /chat/ as an inline block whose sign-in function was never actually
   defined — the button threw `window.__mgSignIn is not a function` and did nothing.

   Redirect strategy: every sign-in returns to ONE url, /auth/, which then sends the user back
   to wherever they started. That means exactly one Redirect URL has to be allowlisted in the
   Supabase dashboard instead of one per page, and adding a new page never breaks login.

   Usage:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="/assets/auth.js"></script>
     ...
     MG.auth.signIn()          // start Google OAuth
     MG.auth.signOut()
     MG.auth.user()            // cached user or null
     MG.auth.onChange(fn)      // fires on load and on every change
     MG.auth.mountChip('#el')  // drop a sign-in / account control into a header
   ============================================================================================ */
(function () {
  'use strict';

  var URL_ = 'https://yuntwerxahgmaoduxvqc.supabase.co';
  var KEY_ = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';

  var CACHE_KEY = 'mg_user';        // kept: /chat/ already reads this shape
  var RETURN_KEY = 'mg_return_to';
  var CALLBACK = '/auth/';

  var client = null;
  var listeners = [];
  var cached = null;

  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { cached = null; }

  function getClient() {
    if (client) return client;
    if (!window.supabase || !window.supabase.createClient) return null;
    client = window.supabase.createClient(URL_, KEY_, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    return client;
  }

  function shape(user) {
    if (!user) return null;
    var m = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      displayName: m.full_name || m.name || (user.email || '').split('@')[0] || 'Learner',
      photoURL: m.avatar_url || m.picture || null,
    };
  }

  function setUser(u) {
    cached = u;
    try {
      if (u) localStorage.setItem(CACHE_KEY, JSON.stringify(u));
      else localStorage.removeItem(CACHE_KEY);
    } catch (e) { /* storage blocked */ }
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](u); } catch (e) { console.warn('[auth] listener failed', e); }
    }
    renderChips();
  }

  function signIn() {
    var c = getClient();
    if (!c) { console.warn('[auth] supabase-js not loaded'); return; }
    // remember where to come back to; the callback page reads this
    try { sessionStorage.setItem(RETURN_KEY, location.pathname + location.search); } catch (e) {}
    return c.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin + CALLBACK,
        // asks Google to show the chooser rather than silently reusing one account
        queryParams: { prompt: 'select_account' },
      },
    }).then(function (r) {
      if (r && r.error) console.error('[auth] signIn failed', r.error.message);
      return r;
    });
  }

  function signOut() {
    var c = getClient();
    setUser(null);
    if (!c) return Promise.resolve();
    return c.auth.signOut().catch(function (e) { console.warn('[auth] signOut', e); });
  }

  function refresh() {
    var c = getClient();
    if (!c) return Promise.resolve(null);
    return c.auth.getSession().then(function (r) {
      var u = shape(r && r.data && r.data.session && r.data.session.user);
      setUser(u);
      return u;
    }).catch(function () { return cached; });
  }

  // ---- header chip ---------------------------------------------------------------------
  var chipTargets = [];

  function renderChips() {
    for (var i = 0; i < chipTargets.length; i++) paintChip(chipTargets[i]);
  }

  // Desktop header styles for the chip, injected once so every page that mounts it looks the same.
  // The mobile menu (nav-mobile.js) has its own, more specific rules.
  function chipCss() {
    if (document.getElementById('mg-auth-css')) return;
    var st = document.createElement('style');
    st.id = 'mg-auth-css';
    st.textContent =
      '.mg-auth-user{position:relative;display:inline-flex;align-items:center}' +
      '.mg-auth-me{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 12px 0 4px;border:1px solid rgba(13,27,42,.12);border-radius:999px;background:#fff;color:#0d1b2a;font:600 14px/1 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 1px 2px rgba(13,27,42,.06)}' +
      '.mg-auth-me:hover{border-color:rgba(13,27,42,.25)}' +
      '.mg-auth-user img,.mg-auth-ini{width:32px;height:32px;border-radius:50%;object-fit:cover;flex:0 0 auto}' +
      '.mg-auth-ini{display:grid;place-items:center;background:#0b7a72;color:#fff;font:700 14px/1 Inter,system-ui,sans-serif}' +
      '.mg-auth-name{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.mg-auth-me svg{width:12px;height:12px;opacity:.55}' +
      '.mg-auth-pop{position:absolute;right:0;top:calc(100% + 8px);min-width:200px;padding:6px;background:#fff;border:1px solid rgba(13,27,42,.1);border-radius:14px;box-shadow:0 16px 40px -12px rgba(13,27,42,.3);z-index:60}' +
      '.mg-auth-pop[hidden]{display:none}' +
      '.mg-auth-pop small{display:block;padding:8px 10px 6px;color:#6b7686;font:500 12px/1.3 Inter,system-ui,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.mg-auth-out{display:block;width:100%;text-align:left;padding:10px;border:0;border-radius:10px;background:none;color:#b42318;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}' +
      '.mg-auth-out:hover{background:#fef3f2}' +
      '.mg-auth-btn{height:40px;padding:0 16px;border:1px solid rgba(13,27,42,.15);border-radius:999px;background:#fff;color:#0d1b2a;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}' +
      '@media (max-width:900px){.mg-auth-name{display:none}.mg-auth-me{padding:0 8px 0 4px}}';
    document.head.appendChild(st);
  }

  function paintChip(host) {
    if (!host) return;
    chipCss();
    host.innerHTML = '';
    var u = cached;
    if (!u) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mg-auth-btn';
      b.textContent = 'Sign in';
      b.addEventListener('click', function () { signIn(); });
      host.appendChild(b);
      return;
    }
    var wrap = document.createElement('div');
    wrap.className = 'mg-auth-user';
    // Avatar + first name; the button opens a small menu with the full name and Sign out.
    var me = document.createElement('button');
    me.type = 'button';
    me.className = 'mg-auth-me';
    me.setAttribute('aria-haspopup', 'true');
    me.setAttribute('aria-expanded', 'false');
    if (u.photoURL) {
      var img = document.createElement('img');
      img.src = u.photoURL; img.alt = ''; img.referrerPolicy = 'no-referrer';
      me.appendChild(img);
    } else {
      var ini = document.createElement('span');
      ini.className = 'mg-auth-ini';
      ini.textContent = (u.displayName || '?').charAt(0).toUpperCase();
      me.appendChild(ini);
    }
    var name = document.createElement('span');
    name.className = 'mg-auth-name';
    name.textContent = String(u.displayName || 'You').split(/\s+/)[0];
    me.appendChild(name);
    me.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');
    wrap.appendChild(me);
    var pop = document.createElement('div');
    pop.className = 'mg-auth-pop';
    pop.hidden = true;
    var full = document.createElement('small');
    full.textContent = u.displayName || '';
    pop.appendChild(full);
    var out = document.createElement('button');
    out.type = 'button';
    out.className = 'mg-auth-out';
    out.textContent = 'Sign out';
    out.addEventListener('click', function () { signOut(); });
    pop.appendChild(out);
    wrap.appendChild(pop);
    var close = function (e) { if (!wrap.contains(e.target)) { pop.hidden = true; me.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', close); } };
    me.addEventListener('click', function () {
      pop.hidden = !pop.hidden;
      me.setAttribute('aria-expanded', String(!pop.hidden));
      if (!pop.hidden) setTimeout(function () { document.addEventListener('click', close); }, 0);
    });
    host.appendChild(wrap);
  }

  function mountChip(sel) {
    var host = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!host || chipTargets.indexOf(host) !== -1) return;
    chipTargets.push(host);
    paintChip(host);
  }

  // ---- boot ----------------------------------------------------------------------------
  function boot() {
    var c = getClient();
    if (!c) return;
    c.auth.onAuthStateChange(function (_evt, session) {
      setUser(shape(session && session.user));
    });
    refresh();
  }

  window.MG = window.MG || {};
  window.MG.auth = {
    signIn: signIn,
    signOut: signOut,
    refresh: refresh,
    user: function () { return cached; },
    client: getClient,
    onChange: function (fn) {
      if (typeof fn !== 'function') return;
      listeners.push(fn);
      fn(cached);           // fire immediately with what we already know
    },
    mountChip: mountChip,
    RETURN_KEY: RETURN_KEY,
  };

  // /chat/ calls this by name on its Google button
  window.__mgSignIn = signIn;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
