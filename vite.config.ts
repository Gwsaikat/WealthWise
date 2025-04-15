import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable Rollup code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunk for large dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            return 'vendor'; // Put other dependencies in a common bundle
          }
        },
      },
    },
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Improve loading performance with preloading
    assetsInlineLimit: 4096, // Inline assets less than 4kb
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps for production
  },
  // Optimize development experience
  server: {
    port: 3000,
    open: true,
    host: true,
    hmr: {
      overlay: true,
    },
  },
  // Caching and performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: [],
  },
});
