import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  // server: {
  //   proxy: {
  //     '/ws': {
  //       target: 'http://localhost:8080',
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
})