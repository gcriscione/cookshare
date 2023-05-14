// Importa le funzioni necessarie da workbox
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache gli asset generati durante la build
precacheAndRoute(self.__WB_MANIFEST);

// Registra una route per il caching delle pagine HTML
registerRoute(
  // Verifica se la richiesta è per una pagina HTML
  ({ request }) => request.headers.get('accept').includes('text/html'),
  // Utilizza la strategia StaleWhileRevalidate per le pagine HTML
  new StaleWhileRevalidate({
    cacheName: 'html-pages',
    plugins: [
      {
        expiration: {
          maxEntries: 10,                     // Numero massimo di voci nella cache
          maxAgeSeconds: 30 * 24 * 60 * 60,   // Durata massima della cache (30 giorni)
        },
      },
    ],
  })
);

// Registra una route per il caching dei file CSS e JavaScript
registerRoute(
  // Verifica se la richiesta è per un file CSS o JavaScript
  /\.(?:js|css)$/,
  // Utilizza la strategia StaleWhileRevalidate per i file CSS e JavaScript
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      {
        expiration: {
          maxEntries: 60, // Numero massimo di voci nella cache
          maxAgeSeconds: 30 * 24 * 60 * 60, // Durata massima della cache (30 giorni)
        },
      },
    ],
  })
);

// Registra una route per il caching delle immagini e altri contenuti multimediali
registerRoute(
  // Verifica se la richiesta è per un'immagine o contenuto multimediale
  /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
  // Utilizza la strategia StaleWhileRevalidate per immagini e contenuti multimediali
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      {
        expiration: {
          maxEntries: 60,                   // Numero massimo di voci nella cache
          maxAgeSeconds: 2 * 24 * 60 * 60,  // Durata massima della cache (2 giorni)
        },
      },
    ],
  })
);