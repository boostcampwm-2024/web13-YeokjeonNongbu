import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.de
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    cors: true,
    hmr: false,
    proxy: {
      '/ws': {
        target: 'http://yeokjeonnongbu.shop:8080',
        changeOrigin: true,
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
