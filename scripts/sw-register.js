(() => {
  if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('service-worker.js').then((reg) => {
        if (!navigator.serviceWorker.controller) {
          return;
        }

        if (reg.waiting) {
          updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', function () {
          trackInstalling(reg.installing);
        });
      }
    )
  }

  let updateReady = (worker) => {
    this.dispatchEvent(new CustomEvent('update-toast', {bubbles: true}));
    worker.postMessage({action: 'skip-waiting'});
  };

  let trackInstalling = (worker) => {
    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed') {
        updateReady(worker);
      }
    })
  };

})();
