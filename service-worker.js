const CACHE_NAME = "pibic-pro-v2";

// Arquivos essenciais
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"
];

// INSTALAÇÃO
self.addEventListener("install", event => {
  console.log("Service Worker instalado");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ATIVAÇÃO
self.addEventListener("activate", event => {
  console.log("Service Worker ativado");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH (offline-first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {

      // Se tiver cache → retorna
      if (response) return response;

      // Senão busca da internet
      return fetch(event.request)
        .then(networkResponse => {

          // Salva no cache
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        })
        .catch(() => {
          // fallback offline
          return caches.match("./index.html");
        });
    })
  );
});
