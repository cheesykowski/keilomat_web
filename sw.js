self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pwa-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './app.js',
        './manifest.json',
        './sw.js',
        './icon-192.png',
        './icon-512.png',
        './volkswagen_t2_campervan.glb'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
