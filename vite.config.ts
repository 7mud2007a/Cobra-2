import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 100% static build → dist/. Relative base so it can be hosted at any path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', outDir: 'dist', sourcemap: false },
})
