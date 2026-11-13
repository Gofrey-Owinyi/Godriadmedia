/* GodriadMedia service worker - v1. Makes the app installable + loads faster offline. Does NOT delete anything. */
var CACHE = 'godriadmedia-v1';
var CORE = ['./', './index.html', './manifest.json'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(CORE); }).catch(function() {}));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      var go = fetch(e.request).then(function(res) {
        if (res && res.status === 200 && e.request.url.indexOf('http') === 0) {
          var copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, copy); }).catch(function() {});
        }
        return res;
      }).catch(function() { return hit; });
      return hit || go;
    })
  );
});
