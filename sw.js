var CACHE = 'mfit-v5';
var CORE = ['/treinos-emerson/', '/treinos-emerson/index.html'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(CORE); }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({type: 'window'}).then(function(clients) {
        clients.forEach(function(c) { c.postMessage({type: 'SW_UPDATED'}); });
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Nunca cacheia requisições externas (JSONBin, APIs)
  if (!url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request));
    return;
  }

  // HTML: network-first (garante versão atualizada)
  if (url.endsWith('/') || url.includes('index.html')) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Demais assets: cache-first com atualização em background
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var network = fetch(e.request).then(function(res) {
        if (res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});
