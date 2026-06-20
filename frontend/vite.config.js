import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Conditionally set base path: '/' for Vercel deployment (avoids asset load failure on nested route refresh) 
  // and './' for Android APK local filesystem loading.
  base: process.env.VERCEL ? '/' : './',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://agroai-9ibe.onrender.com',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure chunk names are stable / don't include hashes that break Android asset loading
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})
