import { defineConfig } from 'vite';
import { generateSW } from 'workbox-build';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'generate-service-worker',
      apply: 'build',
      async closeBundle() {
        const { generateSW } = await import('workbox-build');
        const config = (await import(path.resolve(__dirname, 'workbox-config.js'))).default;
        await generateSW(config);
        console.log('Service worker generated.');
      },
    },
  ],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.html',
    },
  },
});
