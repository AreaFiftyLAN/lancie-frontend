module.exports = {
  staticFileGlobs: [
    'index.html',
    'ce-fix.html',
    'manifest.json',
    'favicon.ico',
    'data/**/*',
    'images-optimized/**/*',
    'scripts/**/*',
    'bower_components/webcomponentsjs/webcomponents-loader.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/data\/.*.(json|md)/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'data-cache'
        }
      }
    },
    {
      urlPattern: /api\.areafiftylan.nl\/api\/v1\/web/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'api-cache'
        }
      }
    },
    {
      urlPattern: /fonts\.(gstatic|googleapis)\.com/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'api-cache'
        }
      }
    },
  ],
  navigateFallback: 'index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
};
