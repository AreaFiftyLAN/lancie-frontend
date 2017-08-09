module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/images-optimized/**',
    '/src/**',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.j'
  ],
  navigateFallback: '/index.html',
  runtimeCaching: [{
    urlPattern: '/https:\\/\\/fonts\\.googleapis\\.com\\//',
    handler: 'cacheFirst'
  }]
};
