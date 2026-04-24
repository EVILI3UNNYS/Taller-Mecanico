import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  base: './', // <-- ¡Esta es la línea mágica que evita la pantalla blanca!
  build: {
    rollupOptions: {
      external: ['@capacitor/core', '@capacitor/filesystem', '@capacitor/share']
    }
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.js',
      },
    }),
  ],
})