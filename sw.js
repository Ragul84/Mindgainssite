// MindGains service worker: only push notifications for now (no offline caching, so it can
// never serve a stale page). Kept at the root so its scope covers the whole site.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'MindGains', body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Today's current affairs are ready", {
    body: d.body || 'Race today\'s facts in NationLap.',
    icon: '/assets/icons/mindgains-logo-192.png',
    badge: '/assets/icons/mindgains-logo-192.png',
    tag: d.tag || 'mindgains-daily',
    renotify: false,
    data: { url: d.url || '/nationlap/?affairs=1' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/nationlap/?affairs=1', self.location.origin).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) if (w.url.startsWith(self.location.origin) && 'focus' in w) { await w.navigate(url).catch(() => {}); return w.focus(); }
    return self.clients.openWindow(url);
  })());
});
