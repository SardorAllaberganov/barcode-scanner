const CACHE_NAME = 'barcode-scanner-v1';
const CACHE_FILES = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icon-512x512.png',
    'https://unpkg.com/@zxing/library@latest'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                CACHE_FILES.map((file) => {
                    return cache.add(file).catch((err) => {
                        console.error(`Failed to cache ${file}:`, err);
                    });
                })
            );
        })
    );
    self.skipWaiting();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        }).catch(() => caches.match('./index.html'))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
