self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('your-cache-name')
        .then(cache => cache.addAll(['/index.html', '/src/index.css', '/src/index.js', '/src/App.js', '/src/Map.js']))
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  });
  