module.exports = {
  staticFileGlob: [
    'manifest.json',
    'favicon.ico',
    'favicon.jpg',
    'images-optimized/*',
    'bower_components/webcomponentsjs/webcomponents-loader.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/bower_components\/webcomponentsjs\/.*.js/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'webcomponentsjs-polyfills-cache'
        }
      }
    },
    {
      urlPattern: /\/data\/.*.(json|md)/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'data-cache'
        }
      }
    }
  ],
  importScripts: ['scripts/sw-message.js'],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
};
