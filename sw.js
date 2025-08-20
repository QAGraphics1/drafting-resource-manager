// Service Worker for Training Resource Library PWA
// Version 2.1.0

const CACHE_NAME = 'training-resources-v2.1.0';
const STATIC_CACHE = 'training-resources-static-v2.1.0';

// Files to cache for offline functionality
const urlsToCache = [
    './',
    './index.html',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-192x192.png',
    './icons/icon-256x256.png',
    './icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing v2.1.0');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // Force activation of new service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating v2.1.0');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete old caches that don't match current version
                    if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all pages immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip GitHub API requests (always use network)
    if (event.request.url.includes('api.github.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    // For HTML files, check if we have a newer version
                    if (event.request.destination === 'document') {
                        // Fetch in background to update cache
                        fetch(event.request)
                            .then((fetchResponse) => {
                                if (fetchResponse.ok) {
                                    const responseClone = fetchResponse.clone();
                                    caches.open(STATIC_CACHE)
                                        .then((cache) => {
                                            cache.put(event.request, responseClone);
                                        });
                                }
                            })
                            .catch(() => {
                                // Network failed, stick with cache
                            });
                    }
                    return response;
                }

                // No cache, fetch from network
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Check if valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Clone response for cache
                        const responseToCache = fetchResponse.clone();

                        // Add to cache
                        caches.open(STATIC_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch(() => {
                        // Network failed and no cache
                        if (event.request.destination === 'document') {
                            return new Response(
                                `<!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Offline - Training Resources</title>
                                    <style>
                                        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                                               text-align: center; padding: 50px; background: #f3f2f1; }
                                        .offline { background: white; padding: 40px; border-radius: 8px; 
                                                  display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                        h1 { color: #0078d4; }
                                        p { color: #605e5c; }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline">
                                        <h1>📚 Training Resources</h1>
                                        <h2>You're Offline</h2>
                                        <p>Please check your internet connection and try again.</p>
                                        <button onclick="window.location.reload()">Retry</button>
                                    </div>
                                </body>
                                </html>`,
                                {
                                    headers: { 'Content-Type': 'text/html' }
                                }
                            );
                        }
                    });
            })
    );
});

// Handle update available
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for gist updates (when online)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-gist') {
        console.log('Service Worker: Background sync triggered');
        
        event.waitUntil(
            // Notify main app that sync is available
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'BACKGROUND_SYNC',
                        action: 'gist-sync-available'
                    });
                });
            })
        );
    }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Training Resources', {
                body: data.body || 'New resources available',
                icon: './icons/icon-192x192.png',
                badge: './icons/icon-96x96.png',
                tag: 'training-resources',
                requireInteraction: false,
                actions: [
                    {
                        action: 'open',
                        title: 'Open App'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            })
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clients) => {
                    // Focus existing window if available
                    for (const client of clients) {
                        if (client.url.includes(self.location.origin)) {
                            return client.focus();
                        }
                    }
                    // Open new window
                    return self.clients.openWindow('/');
                })
        );
    }
});

console.log('Service Worker: Loaded v2.1.0');
