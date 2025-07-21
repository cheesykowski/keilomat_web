self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pwa-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './app.js?v=1.0.0',
        './manifest.json',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
