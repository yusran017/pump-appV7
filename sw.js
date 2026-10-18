/* Service Worker — ทำให้แอปเปิดได้แม้เน็ตหลุด และ Chrome เสนอให้ติดตั้ง */
const CACHE = 'pump-transfer-v16';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './audio/male/0.mp3',
  './audio/male/1.mp3',
  './audio/male/2.mp3',
  './audio/male/3.mp3',
  './audio/male/4.mp3',
  './audio/male/5.mp3',
  './audio/male/6.mp3',
  './audio/male/7.mp3',
  './audio/male/8.mp3',
  './audio/male/9.mp3',
  './audio/female/0.mp3',
  './audio/female/1.mp3',
  './audio/female/2.mp3',
  './audio/female/3.mp3',
  './audio/female/4.mp3',
  './audio/female/5.mp3',
  './audio/female/6.mp3',
  './audio/female/7.mp3',
  './audio/female/8.mp3',
  './audio/female/9.mp3',
  './audio/beep.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => { try { c.put(e.request, copy); } catch (err) {} });
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
