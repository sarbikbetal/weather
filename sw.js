const staticCache = 'static-v1';
const dynamicCache = 'dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/styles.css',
  '/newScript.js',
  '/js/material.min.js',
  '/js/materialize.min.js',
  '/css/materialize.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  // '/pages/fallback.html',
  '/manifest.json',
  '/images/favicon.ico',
  '/images/Gear.png',
  '/images/insight.png',
  '/images/map.png',
  '/images/overview.png',
  '/images/place.png',
  '/images/show.png',
  '/images/theme.png',
  '/images/unit.png'
];

// Cache size limiting functiom
const limitCache = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCache(name, size));
      }
    })
  })
}

// 'install' event handler
self.addEventListener('install', evt => {
  console.log("Service worker installed");
  evt.waitUntil(
    caches.open(staticCache)
      .then(cache => {
        cache.addAll(assets)
          .then(console.log("Assets Cached")
          );
      }).catch(err => {
        console.log(err);
      })
  );
});

// 'activate' event handler
self.addEventListener('activate', evt => {
  console.log("Service worker activated");
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== staticCache && key !== dynamicCache)
          .map(key => caches.delete(key))
      );
    })
  )
});

// 'fetch' event handler
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => {
      return res || fetch(evt.request).then(async fetchRes => {
        // const cache = await caches.open(dynamicCache);
        // cache.put(evt.request.url, fetchRes.clone());
        // limitCache(dynamicCache, 8);
        return fetchRes;
      });
    }).catch(() => {
    })
  );
});