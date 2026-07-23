const CACHE_NAME = 'hunarmand-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Network-first for API/data requests
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    )
    return
  }

  // Cache-first for static assets
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return res
      }))
    )
    return
  }

  // Network-first with cache fallback for pages
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return res
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/dashboard')))
  )
})

// Background sync for offline order actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncPendingActions())
  }
})

async function syncPendingActions() {
  // In production: read from IndexedDB and POST to server
  console.log('[SW] Syncing pending offline actions...')
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body || 'You have a new update',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/dashboard' },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'HunarmandAI', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action !== 'dismiss') {
    event.waitUntil(
      self.clients.openWindow(event.notification.data?.url || '/dashboard')
    )
  }
})
