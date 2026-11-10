/* Programação da Onduladeira Prime — service worker.
   Endereço próprio: https://marcilianocamargo-stack.github.io/programacao-onduladeira/
   Para forçar atualização nos aparelhos: mude o número da versão e faça o commit.
   O nome do cache começa com "programacao-onduladeira-" e só os caches com esse começo são apagados aqui:
   todos os apps da Prime ficam no mesmo endereço (github.io) e dividem o mesmo armazenamento. */
const VERSAO = 'programacao-onduladeira-v1';
const ARQUIVOS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('programacao-onduladeira-') && k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSAO).then(c => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request))
  );
});
