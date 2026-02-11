import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://user-service:4001',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://user-service:4001',
        changeOrigin: true,
      },
      '/api/items': {
        target: 'http://item-service:4002',
        changeOrigin: true,
      },
      '/api/reminders': {
        target: 'http://reminder-service:4003',
        changeOrigin: true,
      },
    },
  },
})