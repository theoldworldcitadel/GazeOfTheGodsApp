const CACHE_NAME = 'gaze-of-the-gods-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('%cService Worker: Installed', 'color: #22c55e');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('%cService Worker: Caching files', 'color: #eab308');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Caching failed:', err))
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('%cService Worker: Activated', 'color: #22c55e');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('%cService Worker: Deleting old cache', 'color: #ef4444');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event - Serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If offline and file not in cache, return index.html (SPA fallback)
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      })
  );
});

// Optional: Background Sync (for future features like saving game state)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-champions') {
    console.log('Background sync triggered');
    // Can be expanded later for data persistence
  }
});

console.log('%cGaze of the Gods Service Worker loaded successfully!', 'color: #9f1239; font-weight: bold');