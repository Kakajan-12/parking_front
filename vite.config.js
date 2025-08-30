import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://172.16.4.204:3000', // URL бэкенда
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:3000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  server: {
    proxy: {
      '/api': {
        target: 'http://172.16.4.204:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://172.16.4.204');
          });
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
})
