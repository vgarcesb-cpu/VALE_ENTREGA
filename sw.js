// ============================================================
// SERVICE WORKER — AGA PROTOCOLO
// Versión: aga-protocolo-v1
//
// CORRECCIONES APLICADAS:
// - Cache-first para assets locales (funciona sin internet)
// - Network-first para Tailwind CDN (siempre intenta actualizar)
// - Limpieza automática de cachés antiguas al activar
// ============================================================

const CACHE_NAME = 'aga-protocolo-v1';

// Archivos que se guardan en el S25 para funcionar sin internet
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

// ── INSTALACIÓN ──────────────────────────────────────────────
// Guarda todos los assets en caché del S25 al instalar la PWA
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Activa el SW inmediatamente sin esperar a recargar
  self.skipWaiting();
});

// ── ACTIVACIÓN ───────────────────────────────────────────────
// Elimina cachés de versiones anteriores para liberar espacio en S25
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Toma control de la app inmediatamente
  self.clients.claim();
});

// ── ESTRATEGIA DE CACHÉ ───────────────────────────────────────
// Para Tailwind CDN → Network first (intenta red, si falla usa caché)
// Para todo lo demás → Cache first (máxima velocidad en S25 en terreno)
self.addEventListener('fetch', (e) => {

  // Tailwind CDN: siempre intenta la red primero
  if (e.request.url.includes('cdn.tailwindcss.com')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          // Guarda la respuesta en caché para uso offline
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Todo lo demás: caché primero (funciona offline en terreno)
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
