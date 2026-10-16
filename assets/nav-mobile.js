/* ============================================================================================
   MindGains — mobile navigation.

   Why this exists: every stylesheet on the site hides the header's links on small screens, and
   nothing ever replaced them. `mindgains-redesign.css` hides `.site-nav nav` below 680px,
   `quiz-hub.css` hides it below 540px, the standalone pages hide `.navlinks`, and the homepage
   hides its `.lnk` items individually. A `.nav-toggle` is styled in site-responsive.css but the
   button it targets exists in no page's markup. Net effect: on phones — most of the traffic —
   the header links (UPSC, TNPSC, SSC, Quiz Hub, Editorial, Know India, Samacheer, NationLap)
   were unreachable from every page on the site.

   Three different header structures are in use, each with its own breakpoint, so this does not
   try to match media queries. It asks the far more reliable question: are the real links
   actually hidden right now? If they are, it offers a menu; if they aren't, it gets out of the
   way. That stays correct no matter which stylesheet loaded or what the breakpoint is.

   The button and panel are built here rather than injected into ~1,100 HTML files, so the
   markup is untouched and a page that loads without this script behaves exactly as it did
   before — it simply has no menu, which is the situation this replaces.
   ============================================================================================ */
(function () {
  'use strict';

  var OPEN = 'mg-open';

  // Where each known header keeps its navigation links. First match wins.
  var SYSTEMS = [
    { header: 'header.nav2',     links: '.links a' },       // 2026 exam hubs
    { header: 'header.site-nav', links: 'nav a' },          // ~1,087 inner pages
    // The standalone pages are not consistent with each other: the quiz hub uses
    // <nav class="navlinks">, editorial/misa/study-lab use <nav class="links">. Matching the
    // <nav> itself rather than either class covers both and anything else of that shape.
    { header: 'header.nav',      links: 'nav a' },          // quiz hub, editorial, study lab, misa…
    { header: 'header',          links: '.hnav a.lnk' }     // homepage
  ];

  // Never pull the brand or the primary call-to-action into the menu: the brand is the way
  // home and the CTA is meant to stay visible in the bar.
  var EXCLUDE = '.brand, .nav-cta, .button, .btn, .cta, .submit, [class*="cta-"]';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function hidden(el) {
    if (!el) return true;
    if (el.offsetParent === null) return true;              // display:none on it or an ancestor
    var r = el.getBoundingClientRect();
    return r.width < 1 || r.height < 1;
  }

  /* The styles ship with the script instead of living in a stylesheet. The quiz hub, editorial,
     study lab, misa and the homepage load none of the shared CSS files — they are self-contained
     pages with inline <style> — so a rule added to mindgains-redesign.css or quiz-hub.css would
     never reach them. Inlining here guarantees the menu is styled wherever the script runs, and
     removes a second cache version to keep in step. */
  function injectStyles() {
    if (document.getElementById('mg-nav-style')) return;
    var css =
      '.mg-navhost{position:relative}' +
      // The backdrop is a fixed child of <body> at z-index 998 while the header carries its
      // own z-index, which opens a stacking context the menu cannot escape — every link sat
      // UNDER the backdrop and nothing was clickable. Lifting the header above the backdrop
      // while open is what makes the panel reachable.
      'body.menu-open .mg-navhost{z-index:1000}' +
      '.mg-navtoggle{display:none;flex-direction:column;align-items:center;justify-content:center;' +
        'gap:4px;width:44px;height:44px;flex:0 0 auto;margin-left:auto;margin-right:8px;padding:0;' +
        'border-radius:13px;cursor:pointer;background:var(--mgm-btn-bg);border:1px solid var(--mgm-line)}' +
      '.mg-navtoggle span{display:block;width:18px;height:2px;border-radius:2px;background:var(--mgm-bar);' +
        'transition:transform .22s cubic-bezier(.4,0,.2,1),opacity .18s linear}' +
      '.mg-open .mg-navtoggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}' +
      '.mg-open .mg-navtoggle span:nth-child(2){opacity:0}' +
      '.mg-open .mg-navtoggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}' +
      '.mg-navtoggle:focus-visible{outline:3px solid rgba(0,212,199,.5);outline-offset:2px}' +
      '.mg-menu{display:none;position:absolute;top:100%;left:12px;right:12px;z-index:1099;' +
        'margin-top:8px;padding:10px;border-radius:20px;flex-direction:column;align-items:stretch;gap:4px;' +
        'background:var(--mgm-panel);border:1px solid var(--mgm-line);box-shadow:var(--mgm-shadow)}' +
      '.mg-open .mg-menu{display:flex}' +
      '.mg-menu a{display:flex;align-items:center;min-height:48px;padding:0 14px;border-radius:13px;' +
        'color:var(--mgm-ink);font-weight:650;font-size:15px;line-height:1.3;text-decoration:none}' +
      '.mg-menu a:hover,.mg-menu a:focus-visible{background:var(--mgm-hover)}' +
      '.site-nav-backdrop{position:fixed;inset:0;z-index:998;background:var(--mgm-scrim);' +
        'opacity:0;pointer-events:none;transition:opacity .22s ease}' +
      'body.menu-open .site-nav-backdrop{opacity:1;pointer-events:auto}' +
      'body.menu-open{overflow:hidden}' +
      '.mg-menu .mg-auth-slot{display:block;margin-top:4px;padding-top:10px;border-top:1px solid var(--mgm-line)}' +
      '.mg-menu .mg-auth-slot button,.mg-menu .mg-auth-btn{width:100%;min-height:48px;border-radius:13px;border:0;background:transparent;color:var(--mgm-ink);font:inherit;font-weight:650;font-size:15px;text-align:left;padding:0 14px;cursor:pointer}' +
      '.mg-menu .mg-auth-user{display:flex;align-items:center;gap:10px;min-height:48px;padding:0 14px;color:var(--mgm-ink);font-weight:650;font-size:15px}' +
      '.mg-menu .mg-auth-user img,.mg-menu .mg-auth-ini{width:28px;height:28px;border-radius:50%;flex:0 0 auto}' +
      '.mg-light{--mgm-btn-bg:#fff;--mgm-line:rgba(15,23,42,.12);--mgm-bar:#0f172a;--mgm-panel:#fff;' +
        '--mgm-ink:#0f172a;--mgm-hover:#eefbf9;--mgm-shadow:0 24px 54px rgba(15,23,42,.18);--mgm-scrim:rgba(15,23,42,.42)}' +
      '.mg-dark{--mgm-btn-bg:rgba(255,255,255,.06);--mgm-line:rgba(255,255,255,.16);--mgm-bar:#fff;' +
        '--mgm-panel:#0f1113;--mgm-ink:#fff;--mgm-hover:rgba(255,255,255,.09);--mgm-shadow:0 24px 54px rgba(0,0,0,.6);--mgm-scrim:rgba(0,0,0,.55)}' +
      '@media(prefers-reduced-motion:reduce){.mg-navtoggle span,.site-nav-backdrop{transition:none}}';
    var s = document.createElement('style');
    s.id = 'mg-nav-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* Pick the panel theme from what the header is actually painted, rather than from the page's
     URL or stylesheet: the same markup renders dark on the mcq pages and light everywhere else. */
  function isDarkSurface(el) {
    var n = el;
    while (n && n !== document.documentElement) {
      var c = getComputedStyle(n).backgroundColor;
      var m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (m && (m[4] === undefined || +m[4] > 0.5)) {
        var lum = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
        return lum < 0.5;
      }
      n = n.parentElement;
    }
    return false;
  }

  ready(function () {
    var header = null, links = null;
    for (var i = 0; i < SYSTEMS.length; i++) {
      var h = document.querySelector(SYSTEMS[i].header);
      if (!h) continue;
      var found = [].slice.call(h.querySelectorAll(SYSTEMS[i].links))
        .filter(function (a) { return a.getAttribute('href') && !a.closest(EXCLUDE); });
      if (found.length) { header = h; links = found; break; }
    }
    if (!header || !links || !links.length) return;

    injectStyles();
    header.classList.add('mg-navhost');
    header.classList.add(isDarkSurface(header) ? 'mg-dark' : 'mg-light');

    var btn = header.querySelector('.site-nav-toggle, .mg-navtoggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.innerHTML = '<span></span><span></span><span></span>';
      var cta = header.querySelector('.nav-cta, .button.primary, .btn.sm');
      if (cta && cta.parentNode) cta.parentNode.insertBefore(btn, cta);
      else header.appendChild(btn);
    }
    btn.classList.add('mg-navtoggle');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');

    // The panel holds copies, so each page's own layout rules for its real nav are left alone.
    var panel = document.createElement('div');
    panel.className = 'mg-menu';
    panel.id = 'mg-site-menu';
    links.forEach(function (a) {
      var c = document.createElement('a');
      c.href = a.getAttribute('href');
      c.textContent = (a.textContent || '').trim();
      if (c.textContent) panel.appendChild(c);
    });
    btn.setAttribute('aria-controls', panel.id);
    // Appended to the header, not beside the button: the header is the element carrying
    // position:relative, so the panel's top/left/right resolve against the bar itself even on
    // the layouts that wrap their contents in an inner .wrap div.
    header.appendChild(panel);

    var backdrop = document.querySelector('.site-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'site-nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function isOpen() { return header.classList.contains(OPEN); }

    function setOpen(open) {
      header.classList.toggle(OPEN, open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      setOpen(false);
      if (returnFocus) { try { btn.focus(); } catch (e) {} }
    }

    // The menu is offered only while the real links are genuinely unavailable. Measuring the
    // first link with the panel closed keeps this independent of every breakpoint on the site.
    // The account control shares the bar with the logo, the toggle and the CTA. At phone widths
    // that is one element too many — "Sign in" and "Get the app" were each wrapping onto two
    // lines, which is what made the header look broken. It moves into the menu instead, and
    // returns to the bar on wider screens. auth.js repaints into this same host node, so
    // relocating it keeps sign-in and sign-out working.
    var slot = document.querySelector('.mg-auth-slot');
    var slotHome = slot && slot.parentNode;
    var slotNext = slot && slot.nextSibling;

    function placeSlot(intoMenu) {
      if (!slot) return;
      if (intoMenu) {
        if (slot.parentNode !== panel) panel.appendChild(slot);
      } else if (slot.parentNode !== slotHome && slotHome) {
        slotHome.insertBefore(slot, slotNext);
      }
    }

    function sync() {
      var wasOpen = isOpen();
      if (wasOpen) setOpen(false);
      var needed = hidden(links[0]);
      btn.style.display = needed ? 'inline-flex' : 'none';
      placeSlot(needed);
      if (needed && wasOpen) setOpen(true);
    }

    sync();

    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      setOpen(!isOpen());
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    backdrop.addEventListener('click', function () { close(false); });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') close(true);
    });

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(sync, 120);
    });
  });
})();
