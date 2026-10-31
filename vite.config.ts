import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: './',
  plugins: [react(), tailwind(), VitePWA({
    registerType: 'prompt', injectRegister: null,
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      name: 'Fábrica das Possibilidades', short_name: 'Fábrica', lang: 'pt-BR',
      description: 'Uma fábrica de ideias para explorar os princípios da contagem.',
      theme_color: '#112938', background_color: '#112938', display: 'standalone',
      orientation: 'portrait', start_url: './', scope: './',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: { clientsClaim: true, globPatterns: ['**/*.{js,css,html,png,svg,woff2}'], maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 },
    devOptions: { enabled: false },
  })],
});
