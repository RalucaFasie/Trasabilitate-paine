import { defineConfig } from 'vite';
import { resolve } from 'path';
import path from 'path';

export default defineConfig({
  root: 'public',
  base: './',
  publicDir: 'assets',
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src'),
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
        main: path.resolve(__dirname, 'public/index.html'),
        verify: path.resolve(__dirname, 'public/verify.html'),
      },
    },
  },
});
