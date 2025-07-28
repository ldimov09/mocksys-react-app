import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: env.VITE_SITE_BASE,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'icons/*'],
        manifest: {
          name: 'Mocksys',
          short_name: 'Mocksys',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1976d2',
          icons: [
            {
              src: 'icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    preview: {
      https: {
        key: './localhost+1-key.pem',
        cert: './localhost+1.pem'
      },
      port: 3000,
      host: true
    }
  });
}
