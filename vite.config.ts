import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Zachowaj console.log w produkcji dla celów debugowania
    drop: [], // Nie usuwaj console ani debugger
  },
})
