// MANASU Lab — always-fresh service worker (NO offline caching).
// Every request goes to the network with revalidation, so any update you deploy shows instantly everywhere.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k)))) // wipe every old cache
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return; // other sites: browser default
  event.respondWith(
    fetch(req, { cache: 'no-cache' }).catch(() => new Response('You are offline. Please check your internet connection.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))
  );
});
