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
      // WebSocket 연결을 백엔드 서버로 프록시
      '/ws': {
        target: 'https://yeokjeonnongbu.shop',
        changeOrigin: true,
        ws: true // WebSocket 프로토콜 지원
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
