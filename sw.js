// This service worker unregisters itself and clears all caches.
// This forces any stale installed app to pick up the fresh version.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach(client => client.navigate(client.url));
    })()
  );
});

self.addEventListener('fetch', (event) => {
  // Always go to network, never serve from cache.
  event.respondWith(fetch(event.request));
});
