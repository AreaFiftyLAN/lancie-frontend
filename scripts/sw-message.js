self.addEventListener('message', function(event) {
  if (event.data.action === 'skip-waiting') {
    self.skipWaiting();
  }
});
