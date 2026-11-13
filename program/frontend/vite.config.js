import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    headers: { 'Referrer-Policy': 'no-referrer-when-downgrade', 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
    proxy: { '/api': { target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:3300', changeOrigin: true } },
  },
})
