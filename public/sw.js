// Enhanced Service Worker for caching and offline support
const CACHE_NAME = 'rc-construcoes-v1.1.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/og-image.jpg',
  '/placeholder-construction-1.jpg',
  '/placeholder-renovation-1.jpg',
  '/placeholder-exterior-1.jpg',
  '/sitemap.xml',
  '/robots.txt'
];

// Dynamic cache strategies
const IMAGE_CACHE = 'images-v1';
const API_CACHE = 'api-v1';
const FONTS_CACHE = 'fonts-v1';

// Enhanced install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Enhanced fetch event with different strategies for different content types
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First strategy for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request).then(response => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Cache First strategy for fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONTS_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          return cachedResponse || fetch(request).then(response => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Network First strategy for API calls
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.status === 200) {
          caches.open(API_CACHE).then(cache => {
            cache.put(request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Default Cache First strategy for other resources
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

// Enhanced activate event with better cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old caches
        ...cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== IMAGE_CACHE && 
              cacheName !== API_CACHE && 
              cacheName !== FONTS_CACHE) {
            return caches.delete(cacheName);
          }
        }),
        // Take control of all clients
        self.clients.claim()
      ]);
    })
  );
});