// Service Worker for diBoaS Platform
// Basic caching strategy without analytics

const CACHE_NAME = 'diboas-v1';
const urlsToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/js/bootstrap.js',
  '/assets/images/logo_full.png',
  '/assets/images/logo.png',
  '/assets/manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  // Only handle requests for our own domain and HTTP/HTTPS requests
  const url = new URL(event.request.url);

  // Skip chrome-extension, moz-extension, blob, data URLs, etc.
  if (!event.request.url.startsWith('http:') && !event.request.url.startsWith('https:')) {
    return;
  }

  // Skip extension-related requests
  if (url.hostname === 'invalid' || event.request.url.includes('chrome-extension') || event.request.url.includes('moz-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(function (error) {
          // Handle fetch errors gracefully for our domain only
          if (url.hostname === location.hostname || url.hostname === 'localhost') {
            console.warn('Fetch failed for local resource:', event.request.url, error);
          }
          // Return original fetch promise rejection for external resources
          throw error;
        });
      })
  );
});