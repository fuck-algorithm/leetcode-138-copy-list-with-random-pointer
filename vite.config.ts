import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/leetcode-138-copy-list-with-random-pointer/',
  server: {
    port: 64030,
  },
})
