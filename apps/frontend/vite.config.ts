import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    cors: true,
    hmr: {
      protocol: 'wss',
      host: 'yeokjeonnongbu.shop',
      port: 8080
    },
    proxy: {
      '/ws': {
        target: 'http://localhost:8080',
        ws: true
      }
    }
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
