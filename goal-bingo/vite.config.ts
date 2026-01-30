
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages는 저장소 이름에 따라 경로가 달라질 수 있으므로 상대 경로 설정을 사용합니다.
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
});
