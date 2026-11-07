import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: funciona igual en GitHub Pages (/Portafolio_CamilaB/) y en cualquier hosting
export default defineConfig({
  plugins: [react()],
  base: './',
})
