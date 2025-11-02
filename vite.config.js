import { defineConfig } from 'vite';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  base: './',
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        verify: resolve(__dirname, 'public/verify.html'),
      },
    },
  },
});
