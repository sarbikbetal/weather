const staticCache = 'static-v4';
const dynamicCache = 'dynamic-v4';
const apiCache = 'apiCache';
const assets = [
  './',
  'index.html',
  'styles.css',
  'js/ui.js',
  'js/app.js',
  'js/controller.js',
  'js/material.min.js',
  'js/materialize.min.js',
  'css/materialize.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Poppins&display=swap',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'manifest.json',
  'icons/icon144.png',
  'images/favicon.ico',
  'images/favicon-32x32.png',
  'images/place.png',
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
      return res ||
        fetch(evt.request).then(async fetchRes => {
          const cache = await caches.open(dynamicCache);
          cache.put(evt.request.url, fetchRes.clone());
          limitCache(dynamicCache, 8);
          return fetchRes;
        });
    }).catch((err) => {
      console.log(err);
    })
  );

  if (evt.request.url.includes("openweathermap")) {
    evt.waitUntil(
      update(evt.request)
        .then(data => { return refresh(evt.request.url, data) })
        .catch(err => console.log(err))
    )
  }
});

const update = (request) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(request.url).then(async fetchRes => {
        const cache = await caches.open(apiCache);
        cache.put(request.url, fetchRes.clone());
        limitCache(apiCache, 10);
        resolve(fetchRes);
      });

    } catch (error) {
      console.log(error);
      reject();
    }
  })
}

const refresh = (url, response) => {
  return new Promise((resolve, reject) => {
    response.json() // read and parse JSON response
      .then(jsonResponse => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => { // report and send new data to client
            var type = 'weather';
            if (url.includes('forecast'))
              type = 'graph'

            client.postMessage(JSON.stringify({ type: type, data: jsonResponse }))
          })
        })
        resolve(jsonResponse.data); // resolve promise with new data
      })
      .catch(err => reject(err));
  })
}