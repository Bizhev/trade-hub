import axios, { type AxiosInstance } from 'axios'
import { environment } from '../config/environment'
import { mockApiClient } from '@/mocks/api/mockApiClient'

/**
 * Создание реального API клиента
 */
function createRealApiClient(): AxiosInstance {
  console.log('[HTTP Client] Using Real API')

  const apiClient = axios.create({
    baseURL: environment.apiBaseUrl
  })

  // Восстановить токен из localStorage
  const token = localStorage.getItem('bear')
  if (token) {
    apiClient.defaults.headers.common.Authorization = token
  }

  // Перехватчик ответов
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const res = error.response
      console.warn('[HTTP Client] Error:', res)

      if (res) {
        switch (res.status) {
          case 401:
            // Неавторизован - перенаправить на логин
            window.location.href = '/login'
            break
          case 404:
            // Не найдено
            break
          default:
            console.warn('[HTTP Client] Unhandled error status:', res.status)
        }
      }

      return Promise.reject(error)
    }
  )

  return apiClient
}

/**
 * Создание мок API клиента
 */
function createMockApiClient(): AxiosInstance {
  console.log('[HTTP Client] Using Mock API')

  // Создаем фальшивый axios instance
  const mockAxios = axios.create()

  // Перехватываем GET запросы
  mockAxios.get = async (url: string, config?: any) => {
    const path = new URL(url, 'http://localhost').pathname
    let data: any

    // Auth
    if (path === '/api/user/me') {
      data = await mockApiClient.getCurrentUser()
    }
    // Companies
    else if (path === '/api/companies') {
      data = await mockApiClient.getCompanies()
    } else if (path.match(/\/api\/companies\/\d+$/)) {
      const id = parseInt(path.split('/').pop()!)
      data = await mockApiClient.getCompanyById(id)
    } else if (path.includes('/api/companies/ticker/')) {
      const ticker = path.split('/ticker/')[1]
      data = await mockApiClient.getCompanyByTicker(ticker)
    } else if (path === '/api/companies/search') {
      const query = config?.params?.q || ''
      data = await mockApiClient.searchCompanies(query)
    }
    // Instruments
    else if (path === '/api/instruments') {
      const type = config?.params?.type
      const companyId = config?.params?.companyId
      if (companyId) {
        data = await mockApiClient.getInstrumentsByCompany(companyId)
      } else {
        data = await mockApiClient.getInstruments(type)
      }
    } else if (path.match(/\/api\/instruments\/\d+$/)) {
      const id = parseInt(path.split('/').pop()!)
      data = await mockApiClient.getInstrumentById(id)
    } else if (path.includes('/api/instruments/ticker/')) {
      const ticker = path.split('/ticker/')[1]
      data = await mockApiClient.getInstrumentByTicker(ticker)
    } else if (path === '/api/instruments/search') {
      const query = config?.params?.q || ''
      const type = config?.params?.type
      data = await mockApiClient.searchInstruments(query, type)
    }
    // Accounts
    else if (path === '/api/user/accounts') {
      data = await mockApiClient.getAccounts()
    } else if (path.match(/\/api\/user\/accounts\/\d+$/)) {
      const id = parseInt(path.split('/').pop()!)
      data = await mockApiClient.getAccountById(id)
    }
    // Portfolio
    else if (path.match(/\/api\/portfolio\/\d+$/)) {
      const accountId = parseInt(path.split('/').pop()!)
      data = await mockApiClient.getPortfolio(accountId)
    } else if (path.match(/\/api\/portfolio\/\d+\/positions$/)) {
      const accountId = parseInt(path.split('/')[3])
      data = await mockApiClient.getPositions(accountId)
    }
    // Trades
    else if (path === '/api/trades') {
      const accountId = config?.params?.accountId
      data = await mockApiClient.getTrades(accountId)
    } else if (path.match(/\/api\/trades\/\d+$/)) {
      const id = parseInt(path.split('/').pop()!)
      data = await mockApiClient.getTradeById(id)
    } else {
      throw new Error(`Mock API: Unknown route ${path}`)
    }

    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {}
    }
  }

  // Перехватываем POST запросы
  mockAxios.post = async (url: string, body?: any, config?: any) => {
    const path = new URL(url, 'http://localhost').pathname
    let data: any

    if (path === '/api/auth/login') {
      data = await mockApiClient.login(body)
    } else if (path === '/api/trades') {
      data = await mockApiClient.createTrade(body)
    } else {
      throw new Error(`Mock API: Unknown POST route ${path}`)
    }

    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {}
    }
  }

  // Перехватываем DELETE запросы
  mockAxios.delete = async (url: string, config?: any) => {
    const path = new URL(url, 'http://localhost').pathname
    let data: any

    if (path.match(/\/api\/trades\/\d+$/)) {
      const id = parseInt(path.split('/').pop()!)
      data = await mockApiClient.cancelTrade(id)
    } else {
      throw new Error(`Mock API: Unknown DELETE route ${path}`)
    }

    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {}
    }
  }

  return mockAxios as AxiosInstance
}

/**
 * API Client
 * Автоматически выбирает между real и mock API на основе environment
 */
export const api = environment.useMockApi ? createMockApiClient() : createRealApiClient()
