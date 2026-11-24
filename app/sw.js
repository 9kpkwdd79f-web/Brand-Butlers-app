/* Brand Butlers: shows push notifications (new tickets from Dynamic for admins, new jobs for installers).
   Nothing is cached here; the app always loads fresh from the server. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Brand Butlers', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Brand Butlers', { body: d.body || '', icon: 'icon-180.png', badge: 'icon-180.png', tag: d.id || undefined, data: { kind: d.kind || '', job: d.job || '' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const d = e.notification.data || {}; const url = new URL('./?n=' + encodeURIComponent(d.kind || '') + (d.job ? '&job=' + encodeURIComponent(d.job) : ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if (c.url.startsWith(self.registration.scope)) { c.postMessage({ type: 'notif', kind: d.kind, job: d.job }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
