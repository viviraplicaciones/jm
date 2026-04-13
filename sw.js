const CACHE_NAME = 'jm-remodelaciones-v3'; // Cambia el v1 a v2 cuando hagas cambios grandes
const STATIC_ASSETS = [
  './',
  './index.html',
  './logo.jpg',
  './icono.jpg',
  './header.jpg',
  './fondo.jpg',
  './franja_header.jpg',
  './D3Euronism.ttf',
  './01.jpg',
  './02.jpg',
  './03.jpg',
  './04.jpg',
  './05.jpg'
];

// Instalación: Guarda los archivos esenciales en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caché abierto: Guardando archivos para uso offline');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Obliga al nuevo service worker a activarse de inmediato
});

// Activación: Limpia cachés antiguos si cambias el nombre de la versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia de carga: Offline y Actualización automática
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 1. Si está en caché, lo devuelve. Pero también busca la actualización.
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Actualizamos el caché con la nueva versión encontrada
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
          // Si no hay internet, no pasa nada, ya devolvimos la respuesta del caché arriba
      });

      return response || fetchPromise;
    })
  );
});