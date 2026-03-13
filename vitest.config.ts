import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Mirror the alias from vite.config.ts so imports resolve in tests
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Measure only the business-logic layer (services + TanStack Query composables).
      // Vue components, layouts, and legacy composables are covered by Cypress E2E —
      // excluding them prevents inflating the denominator with untestable UI code.
      include: [
        'src/domains/**/*Service.ts',
        'src/domains/**/*Query.ts',
      ],
      exclude: ['src/mocks/**', 'src/shared/config/dts/**'],
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 }
    }
  }
})
