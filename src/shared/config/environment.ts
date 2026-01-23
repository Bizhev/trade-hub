/**
 * Environment Configuration
 * Environment variables management
 */

export const environment = {
  /**
   * Use mock data instead of real API
   */
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',

  /**
   * API base URL
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  /**
   * Development mode
   */
  isDevelopment: import.meta.env.DEV,

  /**
   * Production mode
   */
  isProduction: import.meta.env.PROD,

  /**
   * Application base URL
   */
  baseUrl: import.meta.env.BASE_URL || '/'
}

// Log configuration on load
console.log('[Environment]', {
  useMockApi: environment.useMockApi,
  isDevelopment: environment.isDevelopment,
  isProduction: environment.isProduction
})
