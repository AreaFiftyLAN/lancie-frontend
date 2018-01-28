if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('service-worker.js').then((reg) => {
      if (!navigator.serviceWorker.controller) {
        return;
      }

      if (reg.waiting) {
        updateReady();
        return;
      }

      if (reg.installing) {
        trackInstalling(reg.installing);
        return;
      }

      reg.addEventListener('updatefound', () => {
        trackInstalling(reg.installing);
      });
    }
  )
}

let updateReady = () => {
  document.dispatchEvent(new CustomEvent('update-toast'));
};

let trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady();
    }
  })
};
