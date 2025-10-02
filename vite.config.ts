import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Proxy API requests to the backend to avoid CORS in development
    proxy: {
      '/api': {
        target: 'http://localhost:5150',
        changeOrigin: true,
        secure: false,
        // keep the /api prefix so backend routes remain unchanged
      }
    }
  }
})