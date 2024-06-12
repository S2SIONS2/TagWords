import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://stdict.korean.go.kr/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 경로 재작성
      }
    }
  }
});
