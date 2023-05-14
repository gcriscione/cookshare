/* eslint-disable no-console */

import { register } from 'register-service-worker'

const CACHE_NAME = "CACHE_COOKSHARE";
const STATIC_CACHE_URLS = ["/", ];

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'CookShare: L\'app viene servita dalla cache tramite un service worker.\n' +
        'Per maggiori dettagli, visita https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('CookShare: Il service worker è stato registrato.')
    },
    cached() {
      console.log('CookShare: I contenuti sono stati messi in cache per l\'uso offline.')
      return caches.open('app-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/service-worker.js',
          '/robots.txt',
        ]);
      });
    },
    updatefound() {
      console.log('CookShare: Si stanno scaricando nuovi contenuti.')
    },
    updated() {
      console.log('CookShare: Sono disponibili nuovi contenuti, si prega di aggiornare la pagina.')
    },
    offline() {
      console.log(
        'CookShare: Nessuna connessione Internet trovata. L\'app sta funzionando in modalità offline.'
      )
    },
    error(error) {
      console.error('CookShare: Errore durante la registrazione del service worker:', error)
    }
  })
}