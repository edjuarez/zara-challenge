import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
      preprocessorOptions: {
        scss: {
          // Esto le dice a SCSS: "Antes de compilar cualquier archivo .scss, 
          // inyecta este archivo de variables"
          additionalData: `@use "@/styles/_variables.scss" as *;`
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src' // Esto ayuda a que los imports sean más limpios
      }
    }
})
