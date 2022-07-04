self.addEventListener("install", function (e) {
  console.log("Installing Service Worker", e);
});

self.addEventListener("activate", function (e) {
  console.log("Activated Service Worker", e);
  return self.clients.claim();
});

self.addEventListener('fetch', function (e){
    console.log("Service Worker Fetching Something ...",e)
    e.respondWith(fetch(e.request))
})