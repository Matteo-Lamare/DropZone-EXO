/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repository = process.env.GITHUB_REPOSITORY
const basePath =
  process.env.VITE_BASE_PATH ??
  (repository ? `/${repository.split('/')[1]}/` : '/')

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites below /<repository-name>/.
  // GITHUB_REPOSITORY is provided automatically by GitHub Actions.
  // Locally, the default base remains /.
  base: basePath,
  plugins: [react()],
  server: {
    // In development, /api is forwarded to the API (same path as behind nginx in Docker).
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:8000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
