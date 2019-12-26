if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log("Service Worker registered successfully");

    navigator.serviceWorker.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.type == 'weather') {
        console.log("UI updated");
        updateUI(msg.data);
      }
      else if (msg.type == 'graph') {
        console.log("Graph updated");
        plot(msg.data);
      }

    }
  }).catch(err => {
    console.log("Service Worker error", err);
  })
}

window.addEventListener('offline', function () {
  M.toast({ html: "Sorry, you're offline", classes: 'red' });
});
window.addEventListener('online', function () {
  M.toast({ html: "Yaay! connectivity restored", classes: 'green' });
  refresh();
});