var CACHE_STATIC_NAME = 'static-v15';
var CACHE_DYNAMIC_NAME = 'dynamic-v15';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/css/app.css',
          '/src/css/main.css',
          '/src/js/main.js',
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

// STATIC & DYNAMIC CACHING
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 });
//             })
//             .catch(function(err) {

//             });
//         }
//       })
//   );
// });

// NETWORK ONLY STRATEGY
// self.addEventListener('fetch', function(event){
//   event.respondWith(fetch(event.request)
//   );
// })

// CACHE ONLY STRATEGY and OFFLINE FALLBACK
// self.addEventListener('fetch', function(event){
//   event.respondWith(
//     caches.match(event.request)
//   );
// })

// NETWORK CACHE FALLBACK STARTEGY
// self.addEventListener('fetch', function(event){
//   event.respondWith(
//     fetch(event.request)
//     .then(async function(res){
//       const cache = await caches.open(CACHE_DYNAMIC_NAME);
//       cache.put(event.request.url, res.clone());
//       return res;
//     }).catch((err)=>{
//       return caches.match(event.request)
//     })
//   )
// });

// Dynamic caching for Cache, then network strategy
self.addEventListener('fetch', function (event) {
  if (event.request.url.indexOf('https://httpbin.org/ip') > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request.url, res.clone());
              return res;
            })
        })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  });
              })
              .catch(function (err) {

              });
          }
        })
    );
  }
});

// CACHE THEN NETWORK STRATEGY WITH ROUTING AND OFFLINE SUPPORT
// self.addEventListener('fetch', function(event){
//   var url = 'https://httpbin.org/get';

//   if(event.request.url.indexOf(url) > -1){
//     event.respondWith(
//       caches.open(CACHE_DYNAMIC_NAME)
//       .then(async (cache) => {
//         const res = await fetch(event.request);
//         cache.put(event.request, res.clone());
//         return res;
//       })
//     )
//   }else{
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response){
//           if(response){
//             return response;
//           }else{
//             fetch(event.request)
//             .then((res) => caches.open(CACHE_DYNAMIC_NAME)
//               .then(function (cache) {
//                 cache.put(event.request.url, res.clone());
//                 return res;
//               })).catch((err) => caches.open(CACHE_STATIC_NAME)
//                 .then(function (cache) {
//                   if (event.request.url.indexOf('/dynamic')) {
//                     return cache.match('/offline.html');
//                   }
//                 }))
//           }
//         })
//     )
//   }
// })