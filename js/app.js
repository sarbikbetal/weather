if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log("Service Worker registered successfully");


    navigator.serviceWorker.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg) {
        console.log(msg.type, msg.data);
        // updateUI(data[0]);
        // plot(data[1]);
      }
      console.log('refresh finished');

    }
  }).catch(err => {
    console.log("Service Worker error", err);
  })
}
