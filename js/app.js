if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log("Service Worker registered successfully");
  }).catch(err => {
    console.log("Service Worker error", err);
  })
}
