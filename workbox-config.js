module.exports = {
  skipWaiting: true,
  clientsClaim: true,
  // Directory to match patterns against.
  globDirectory: 'dist',
  // Patterns to precache.
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,mp3,ogg}',
  ],
  // Do not cache-bust URLs that already contain a hash.
  dontCacheBustURLsMatching: /-\w{8}\./,
  // Service worker source file.
  swSrc: 'src/service-worker.ts',
  // Destination for the generated service worker.
  swDest: 'dist/service-worker.js',
  // Runtime caching rules.
  runtimeCaching: [
    {
      // Cache static assets (images, scripts, styles) with a Cache First strategy.
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp|js|css|html)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Audio files should be updated in the background.
      urlPattern: /\.(?:mp3|ogg)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'audio-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  // Enable navigation fallback to index.html for SPA routing.
  navigateFallback: '/index.html',
  // Clean up outdated caches automatically.
  cleanupOutdatedCaches: true,
};
