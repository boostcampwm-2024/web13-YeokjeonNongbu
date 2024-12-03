import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    cors: true,
    hmr: {
      host: 'yeokjeonnongbu.shop',
      port: 8080
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
