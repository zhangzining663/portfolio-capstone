import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// build 时用 GitHub Pages 的子路径 base，本地 dev 仍用根路径
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/portfolio-capstone/' : '/',
  plugins: [react()],
  server: {
    port: 5173
  }
}));
