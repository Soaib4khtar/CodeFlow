import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @/foo -> src/foo (mirrored in tsconfig.app.json paths)
      '@': '/src',
    },
  },
})
