import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite mantiene JSX y recarga rápida durante el desarrollo.
export default defineConfig({
  plugins: [react()],
})
