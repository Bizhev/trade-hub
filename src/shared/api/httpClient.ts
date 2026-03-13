import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { environment } from '../config/environment'
import { mockApiClient } from '@/mocks/api/mockApiClient'

function mockResponse<T>(data: T, config?: AxiosRequestConfig): AxiosResponse<T> {
  return { data, status: 200, statusText: 'OK', headers: {}, config: (config ?? {}) as AxiosResponse['config'] }
}

function createRealApiClient(): AxiosInstance {
  const apiClient = axios.create({ baseURL: environment.apiBaseUrl })

  const token = localStorage.getItem('bear')
  if (token) {
    apiClient.defaults.headers.common.Authorization = token
  }

  apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const res = (error as { response?: { status: number } }).response
      if (res?.status === 401) {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return apiClient
}

function createMockApiClient(): AxiosInstance {
  const mockAxios = axios.create()

  type InstrumentType = 'stock' | 'etf' | 'bond'

  const handleGet = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    const path = new URL(url, 'http://localhost').pathname
    const params = config?.params as Record<string, string> | undefined
    let data: unknown

    if (path === '/api/user/me') {
      data = await mockApiClient.getCurrentUser()
    } else if (path === '/api/companies') {
      data = await mockApiClient.getCompanies()
    } else if (path.match(/\/api\/companies\/\d+$/)) {
      data = await mockApiClient.getCompanyById(parseInt(path.split('/').pop()!))
    } else if (path.includes('/api/companies/ticker/')) {
      data = await mockApiClient.getCompanyByTicker(path.split('/ticker/')[1])
    } else if (path === '/api/companies/search') {
      data = await mockApiClient.searchCompanies(params?.q ?? '')
    } else if (path === '/api/instruments') {
      const type = params?.type as InstrumentType | undefined
      data = params?.companyId
        ? await mockApiClient.getInstrumentsByCompany(parseInt(params.companyId))
        : await mockApiClient.getInstruments(type)
    } else if (path.match(/\/api\/instruments\/\d+$/)) {
      data = await mockApiClient.getInstrumentById(parseInt(path.split('/').pop()!))
    } else if (path.includes('/api/instruments/ticker/')) {
      data = await mockApiClient.getInstrumentByTicker(path.split('/ticker/')[1])
    } else if (path === '/api/instruments/search') {
      const type = params?.type as InstrumentType | undefined
      data = await mockApiClient.searchInstruments(params?.q ?? '', type)
    } else if (path === '/api/user/accounts') {
      data = await mockApiClient.getAccounts()
    } else if (path.match(/\/api\/user\/accounts\/\d+$/)) {
      data = await mockApiClient.getAccountById(parseInt(path.split('/').pop()!))
    } else if (path.match(/\/api\/portfolio\/\d+$/)) {
      data = await mockApiClient.getPortfolio(parseInt(path.split('/').pop()!))
    } else if (path.match(/\/api\/portfolio\/\d+\/positions$/)) {
      data = await mockApiClient.getPositions(parseInt(path.split('/')[3]))
    } else if (path === '/api/trades') {
      data = await mockApiClient.getTrades(params?.accountId ? parseInt(params.accountId) : undefined)
    } else if (path.match(/\/api\/trades\/\d+$/)) {
      data = await mockApiClient.getTradeById(parseInt(path.split('/').pop()!))
    } else {
      throw new Error(`Mock API: Unknown GET route ${path}`)
    }

    return mockResponse(data, config)
  }

  mockAxios.get = handleGet as typeof mockAxios.get

  const handlePost = async (url: string, body?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    const path = new URL(url, 'http://localhost').pathname
    let data: unknown

    if (path === '/api/auth/login') {
      data = await mockApiClient.login(body as Parameters<typeof mockApiClient.login>[0])
    } else if (path === '/api/trades') {
      data = await mockApiClient.createTrade(body as Parameters<typeof mockApiClient.createTrade>[0])
    } else {
      throw new Error(`Mock API: Unknown POST route ${path}`)
    }

    return mockResponse(data, config)
  }

  mockAxios.post = handlePost as typeof mockAxios.post

  const handleDelete = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    const path = new URL(url, 'http://localhost').pathname
    let data: unknown

    if (path.match(/\/api\/trades\/\d+$/)) {
      data = await mockApiClient.cancelTrade(parseInt(path.split('/').pop()!))
    } else {
      throw new Error(`Mock API: Unknown DELETE route ${path}`)
    }

    return mockResponse(data, config)
  }

  mockAxios.delete = handleDelete as typeof mockAxios.delete

  return mockAxios
}

export const api = environment.useMockApi ? createMockApiClient() : createRealApiClient()
