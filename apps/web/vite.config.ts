import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@crewdirectoryapp/shared': path.resolve(
        __dirname,
        '../../packages/shared/src'
      ),
      '@crewdirectoryapp/api-client': path.resolve(
        __dirname,
        '../../packages/api-client/src'
      ),
      // Fix for react-map-gl export issue with Vite 7
      'react-map-gl': path.resolve(
        __dirname,
        '../../node_modules/react-map-gl/dist/mapbox.js'
      ),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
