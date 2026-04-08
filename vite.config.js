import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://qma-parv-production.up.railway.app',
        changeOrigin: true,
      },
      '/oauth2/authorization': {
        target: 'https://qma-parv-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
