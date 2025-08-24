import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@supabase/supabase-js', 'sortablejs'],
        },
      },
    },
    sourcemap: mode !== 'production',
  },
  // Configure public directory and base URL
  publicDir: 'public',
  base: './',  // Use relative paths for all assets
  
  plugins: [
    
  ],
  };
});
