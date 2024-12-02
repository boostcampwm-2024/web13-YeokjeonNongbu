import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'wss',
      host: 'yeokjeonnongbu.shop',
      port: 443
    },
    cors: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  }
});
