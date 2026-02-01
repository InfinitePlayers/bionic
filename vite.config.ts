import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // -------------------------------------------------------------------
  // IMPORTANT: CHANGE THIS IF YOUR REPO NAME IS NOT 'bionic'
  // Example: If your repo is 'brand-tool', change to base: '/brand-tool/'
  // -------------------------------------------------------------------
  base: '/bionic/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
});