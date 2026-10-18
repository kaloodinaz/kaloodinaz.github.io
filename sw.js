const CACHE_NAME = 'cache-v5';          // bumped, so the old v4 cache gets deleted
const MAX_AGE_MS = 6 * 60 * 60 * 1000;  // 6 hours. Use 12 * 60 * 60 * 1000 for 12 hours

const urlsToCache = [
  '/',
  '/index.html',
  '/privacy.html',
  '/termofuse.html',
  '/index.js?v=2.1',
  '/styles.css?v=2.1',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Store a response together with the time it was cached
async function putWithTimestamp(request, response) {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', String(Date.now()));
  const body = await response.clone().blob();
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  }));
}

function isFresh(response) {
  const cachedAt = Number(response.headers.get('sw-cached-at')) || 0;
  return Date.now() - cachedAt < MAX_AGE_MS;
}

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all(
      urlsToCache.map(url =>
        fetch(new Request(url, { cache: 'reload' }))   // bypass HTTP cache
          .then(res => putWithTimestamp(url, res))
          .catch(err => console.log('Precache failed:', url, err))
      )
    ).then(() => self.skipWaiting())                   // activate new SW immediately
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())                // take control of open pages
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // HTML pages: always try the network first, fall back to cache offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          putWithTimestamp(request, res.clone());
          return res;
        })
        .catch(async () =>
          (await caches.match(request, { ignoreSearch: true })) ||
          (await caches.match('/index.html'))
        )
    );
    return;
  }

  // Other assets: use the cache while it is younger than MAX_AGE_MS,
  // otherwise refetch. If offline, use the stale copy.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached && isFresh(cached)) return cached;

      return fetch(request)
        .then(res => {
          putWithTimestamp(request, res.clone());
          return res;
        })
        .catch(() => cached || Response.error());
    })
  );
});
