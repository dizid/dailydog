/**
 * Service Worker for Daily Dog PWA
 * Enables offline capability and caching strategies
 */

const CACHE_NAME = 'dailydog-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Cache first strategy for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((response) => {
            // Cache successful responses
            if (response.ok) {
              const cache = caches.open(CACHE_NAME)
              cache.then((c) => c.put(request, response.clone()))
            }
            return response
          })
        )
      })
    )
    return
  }

  // Network first strategy for API calls
  if (url.pathname.includes('/api/') || url.pathname.includes('/.netlify/functions/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request).then((response) => {
            return response || new Response('Offline - please try again when online', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            })
          })
        })
    )
    return
  }

  // Network first, cache fallback for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const cache = caches.open(CACHE_NAME)
          cache.then((c) => c.put(request, response.clone()))
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return response || caches.match('/')
        })
      })
  )
})
