import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable source maps for debugging (can disable in production)
    sourcemap: false,
    // Reduce chunk size warning threshold
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Core React - rarely changes
          'react-vendor': ['react', 'react-dom'],
          // Google Maps - heavy, load separately
          'maps': ['@react-google-maps/api'],
          // Supabase - auth and data
          'supabase': ['@supabase/supabase-js'],
          // i18n - translations
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // OpenAI - API calls
          'openai': ['openai'],
        },
      },
    },
    // Use esbuild for minification (built-in, faster than terser)
    minify: 'esbuild',
  },
});
