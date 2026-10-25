/* ============================================================================================
   MindGains — minimal page analytics.

   The site has ~708 indexed URLs and had NO analytics at all, which meant every decision about
   what to build was a guess: nobody knew whether those pages get 5 visits a day or 5,000, or
   which of them convert.

   Deliberately tiny and privacy-clean: it records the path, the referring HOST only (never the
   full referring URL), a coarse screen bucket and a timestamp. No cookies, no localStorage, no
   IP, no fingerprint, no identifier of any kind — so there is nothing here that identifies a
   person, nothing to consent to, and nothing that changes the DPDP position. It also means a
   "visit" is a pageview, not a unique user; that is the deliberate trade.

   Reads are closed by RLS; only inserts are allowed. Query it from the Supabase dashboard.
   ============================================================================================ */
(function () {
  'use strict';
  try {
    // don't count local development or the preview worker domain
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h.endsWith('.workers.dev')) return;

    var URL_ = 'https://yuntwerxahgmaoduxvqc.supabase.co/rest/v1/page_views';
    var KEY_ = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';

    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { ref = ''; }
    // our own internal navigation isn't a referrer worth recording
    if (ref === h) ref = '';

    // Which surface sent them — ?src=ig, ?src=app, ?utm_source=... — remembered for the rest of
    // the visit so a signup three pages later is still credited to the thing that brought them.
    // sessionStorage, not a cookie: it dies with the tab and identifies nobody.
    var src = '';
    try {
      var q = new URLSearchParams(location.search);
      src = (q.get('src') || q.get('utm_source') || '').slice(0, 40);
      if (src) sessionStorage.setItem('mg_src', src);
      else src = sessionStorage.getItem('mg_src') || '';
    } catch (e) { src = ''; }

    var w = window.innerWidth || 0;
    var body = JSON.stringify({
      path: location.pathname.slice(0, 300),
      ref: ref.slice(0, 120),
      src: src,
      screen: w < 560 ? 'phone' : w < 1024 ? 'tablet' : 'desktop',
    });

    // fetch + keepalive, NOT sendBeacon.
    //
    // sendBeacon can only issue a "simple" cross-origin request, and application/json forces a
    // CORS preflight it cannot perform. It still returns true (the browser has queued it), so
    // the request was dropped at the network layer with no error and no fallback — pageviews
    // fired from the page and silently never arrived. keepalive gives the same survives-unload
    // behaviour while allowing the preflight and the auth headers.
    fetch(URL_, {
      method: 'POST', keepalive: true, mode: 'cors',
      headers: { apikey: KEY_, Authorization: 'Bearer ' + KEY_, 'Content-Type': 'application/json' },
      body: body,
    }).catch(function () { /* analytics must never affect the page */ });
  } catch (e) { /* never break a page for a pageview */ }
})();
