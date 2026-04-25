import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://vexora-backend-1.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://vexora-backend-1.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
