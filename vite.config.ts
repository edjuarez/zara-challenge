import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
      preprocessorOptions: {
        scss: {
        additionalData: `
            @use "@/styles/_variables.scss" as *;
            @use "@/styles/_breakpoints.scss" as *;
          `
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
})
