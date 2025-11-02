import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import { resolve } from 'path';
import path from 'path';

export default defineConfig({
  root: 'public',
  base: './',
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src'),
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
