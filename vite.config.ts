import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages serves this project under /spine-demo/, so the production build
// needs that base. Dev keeps "/". Asset URLs are prefixed via import.meta.env.BASE_URL.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/spine-demo/' : '/',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
}))
