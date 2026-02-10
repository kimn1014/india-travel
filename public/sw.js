// Service Worker for India Travel 2026 PWA
const CACHE_VERSION = 'india-travel-v6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Pages to pre-cache
const PAGES = [
  '/',
  '/schedule',
  '/hotels',
  '/budget',
  '/weather',
  '/resources',
];

// Voucher PDFs to pre-cache
const VOUCHERS = [
  '/vouchers/flight_DEL_JSA_0214.pdf',
  '/vouchers/flight_JAI_DEL_0219.pdf',
  '/vouchers/flight_HDO_VNS_0220.pdf',
  '/vouchers/flight_VNS_DEL_0221.pdf',
  '/vouchers/voucher_HH2632177268.pdf',
  '/vouchers/booking_1697174974.pdf',
  '/vouchers/booking_1697203885.pdf',
  '/vouchers/booking_1697209146.pdf',
  '/vouchers/airbnb_HMS59YB824.pdf',
  '/vouchers/bus_JSA_UDR_0215.pdf',
  '/vouchers/bus_UDR_JAI_0217.pdf',
  '/vouchers/receipt_1697203885.pdf',
  '/vouchers/receipt_1697209146.pdf',
];

// Install: pre-cache pages and vouchers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching pages and vouchers');
      return cache.addAll([...PAGES, ...VOUCHERS]);
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// Fetch: apply different strategies based on resource type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    // For weather API (open-meteo): Network First
    if (url.hostname.includes('open-meteo.com')) {
      event.respondWith(networkFirst(request));
      return;
    }
    // Other external requests: just fetch
    return;
  }

  // Voucher PDFs: Cache First (they don't change)
  if (url.pathname.startsWith('/vouchers/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Next.js static assets (_next/static/): Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Next.js data/build files: Network First
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images and fonts: Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Pages (HTML navigation): Network First with pre-cache fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else: Network First
  event.respondWith(networkFirst(request));
});

// Cache First: try cache, fallback to network
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Network First: try network, fallback to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // For HTML pages, return the cached home page as fallback
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}
