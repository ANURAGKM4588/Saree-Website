import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Saree-Website/',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/public/images/**'],
    },
  },
})
