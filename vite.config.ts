import { defineConfig } from 'vite';

import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    {
      name: 'generate-service-worker',
      apply: 'build',
      async closeBundle() {
        const { generateSW } = await import('workbox-build');
        const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
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
