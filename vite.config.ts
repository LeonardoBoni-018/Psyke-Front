/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // A Vercel build must never ship a bundle that points at localhost (or at nothing).
  if (env.VERCEL && mode === 'production') {
    const apiUrl = env.VITE_API_URL ?? ''
    if (!/^https:\/\//.test(apiUrl) || /localhost|127\.0\.0\.1/.test(apiUrl)) {
      throw new Error(
        `VITE_API_URL must be the public https URL of the API for Vercel builds (got "${apiUrl}"). ` +
          'Set it in Vercel → Project → Settings → Environment Variables.',
      )
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        output: {
          // Heavy, rarely-changing libraries get their own long-cached chunks.
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
            if (id.includes('@fullcalendar')) return 'calendar'
            if (id.includes('recharts') || id.includes('d3-')) return 'charts'
            return undefined
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api/, ''),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})
