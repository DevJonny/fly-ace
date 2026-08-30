import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Fly Ace',
        short_name: 'FlyAce',
        description: 'Track your airplane kill markings!',
        theme_color: '#ffffff',
        icons: []
      }
    })
  ],
  base: '/fly-ace/' // Explicitly set for GitHub pages to prevent trailing slash issues
});
