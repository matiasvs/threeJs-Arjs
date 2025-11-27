import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/threeJs-Arjs/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
  },
})
