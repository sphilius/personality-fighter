import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
