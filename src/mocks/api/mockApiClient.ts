import { mockStorage } from '../data/storage/mockStorage'
import type { ILoginRequest, ILoginResponse } from '@/domains/accounts/types'
import type { ICreateTradeRequest } from '@/domains/trades/types'
import type { ICompany } from '@/domains/companies/types'
import type { IInstrument } from '@/domains/instruments/types'
import type { IAccount } from '@/domains/accounts/types'
import type { IPortfolio } from '@/domains/portfolio/types'
import type { ITrade } from '@/domains/trades/types'

/**
 * Network delay simulation
 */
const delay = (ms: number = 200 + Math.random() * 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock API Client
 * Emulates REST API with realistic delays
 */
export const mockApiClient = {
  // ============ Auth ============

  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    console.log('[MockAPI] POST /api/auth/login')
    await delay(500)

    const user = mockStorage.getUser()
    if (!user) {
      throw new Error('User not found')
    }

    // Simple validation (для мок-данных)
    if (!credentials.username || !credentials.password) {
      throw new Error('Invalid credentials')
    }

    return {
      access_token: 'mock_jwt_token_' + Math.random().toString(36).substring(7),
      user,
      expiresIn: 3600
    }
  },

  // ============ Companies ============

  async getCompanies(): Promise<ICompany[]> {
    console.log('[MockAPI] GET /api/companies')
    await delay()
    return mockStorage.getCompanies()
  },

  async getCompanyById(id: number): Promise<ICompany> {
    console.log(`[MockAPI] GET /api/companies/${id}`)
    await delay()
    const company = mockStorage.getCompanyById(id)
    if (!company) {
      throw new Error(`Company with id ${id} not found`)
    }
    return company
  },

  async getCompanyByTicker(ticker: string): Promise<ICompany> {
    console.log(`[MockAPI] GET /api/companies/ticker/${ticker}`)
    await delay()
    const company = mockStorage.getCompanyByTicker(ticker)
    if (!company) {
      throw new Error(`Company with ticker ${ticker} not found`)
    }
    return company
  },

  async searchCompanies(query: string): Promise<ICompany[]> {
    console.log(`[MockAPI] GET /api/companies/search?q=${query}`)
    await delay()
    return mockStorage.searchCompanies(query)
  },

  // ============ Instruments ============

  async getInstruments(type?: 'stock' | 'etf' | 'bond'): Promise<IInstrument[]> {
    console.log(`[MockAPI] GET /api/instruments${type ? `?type=${type}` : ''}`)
    await delay()
    if (type) {
      return mockStorage.getInstrumentsByType(type)
    }
    return mockStorage.getInstruments()
  },

  async getInstrumentById(id: number): Promise<IInstrument> {
    console.log(`[MockAPI] GET /api/instruments/${id}`)
    await delay()
    const instrument = mockStorage.getInstrumentById(id)
    if (!instrument) {
      throw new Error(`Instrument with id ${id} not found`)
    }
    return instrument
  },

  async getInstrumentByTicker(ticker: string): Promise<IInstrument> {
    console.log(`[MockAPI] GET /api/instruments/ticker/${ticker}`)
    await delay()
    const instrument = mockStorage.getInstrumentByTicker(ticker)
    if (!instrument) {
      throw new Error(`Instrument with ticker ${ticker} not found`)
    }
    return instrument
  },

  async getInstrumentsByCompany(companyId: number): Promise<IInstrument[]> {
    console.log(`[MockAPI] GET /api/instruments?companyId=${companyId}`)
    await delay()
    return mockStorage.getInstrumentsByCompany(companyId)
  },

  async searchInstruments(query: string, type?: 'stock' | 'etf' | 'bond'): Promise<IInstrument[]> {
    console.log(`[MockAPI] GET /api/instruments/search?q=${query}${type ? `&type=${type}` : ''}`)
    await delay()
    const results = mockStorage.searchInstruments(query)
    if (type) {
      return results.filter((i) => i.type === type)
    }
    return results
  },

  // ============ Accounts ============

  async getCurrentUser(): Promise<IAccount> {
    console.log('[MockAPI] GET /api/user/me')
    await delay()
    const user = mockStorage.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }
    return user as any
  },

  async getAccounts(): Promise<IAccount[]> {
    console.log('[MockAPI] GET /api/user/accounts')
    await delay()
    return mockStorage.getAccounts()
  },

  async getAccountById(id: number): Promise<IAccount> {
    console.log(`[MockAPI] GET /api/user/accounts/${id}`)
    await delay()
    const account = mockStorage.getAccountById(id)
    if (!account) {
      throw new Error(`Account with id ${id} not found`)
    }
    return account
  },

  // ============ Portfolio ============

  async getPortfolio(accountId: number): Promise<IPortfolio> {
    console.log(`[MockAPI] GET /api/portfolio/${accountId}`)
    await delay()
    const portfolio = mockStorage.getPortfolio(accountId)
    if (!portfolio) {
      throw new Error(`Portfolio for account ${accountId} not found`)
    }
    return portfolio
  },

  async getPositions(accountId: number): Promise<IPortfolio['positions']> {
    console.log(`[MockAPI] GET /api/portfolio/${accountId}/positions`)
    await delay()
    const portfolio = mockStorage.getPortfolio(accountId)
    if (!portfolio) {
      throw new Error(`Portfolio for account ${accountId} not found`)
    }
    return portfolio.positions
  },

  // ============ Trades ============

  async getTrades(accountId?: number): Promise<ITrade[]> {
    console.log(`[MockAPI] GET /api/trades${accountId ? `?accountId=${accountId}` : ''}`)
    await delay()
    if (accountId) {
      return mockStorage.getTradesByAccount(accountId)
    }
    return mockStorage.getTrades()
  },

  async getTradeById(id: number): Promise<ITrade> {
    console.log(`[MockAPI] GET /api/trades/${id}`)
    await delay()
    const trade = mockStorage.getTradeById(id)
    if (!trade) {
      throw new Error(`Trade with id ${id} not found`)
    }
    return trade
  },

  async createTrade(request: ICreateTradeRequest): Promise<ITrade> {
    console.log('[MockAPI] POST /api/trades', request)
    await delay(500)

    // Validation
    const account = mockStorage.getAccountById(request.accountId)
    if (!account) {
      throw new Error(`Account with id ${request.accountId} not found`)
    }

    const instrument = mockStorage.getInstrumentById(request.instrumentId)
    if (!instrument) {
      throw new Error(`Instrument with id ${request.instrumentId} not found`)
    }

    const price = request.price || instrument.lastPrice
    const totalAmount = request.quantity * price
    const commission = totalAmount * 0.001

    const newTrade: ITrade = {
      id: mockStorage.getTrades().length + 1,
      accountId: request.accountId,
      instrumentId: request.instrumentId,
      instrumentTicker: instrument.ticker,
      instrumentName: instrument.name,
      type: request.type,
      side: request.side,
      quantity: request.quantity,
      price,
      totalAmount,
      commission,
      status: request.type === 'market' ? 'executed' : 'pending',
      executedAt: request.type === 'market' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString()
    }

    mockStorage.addTrade(newTrade)
    return newTrade
  },

  async cancelTrade(id: number): Promise<ITrade> {
    console.log(`[MockAPI] DELETE /api/trades/${id}`)
    await delay(300)

    const trade = mockStorage.getTradeById(id)
    if (!trade) {
      throw new Error(`Trade with id ${id} not found`)
    }

    if (trade.status === 'executed') {
      throw new Error('Cannot cancel executed trade')
    }

    const updatedTrade = mockStorage.updateTrade(id, { status: 'cancelled' })
    if (!updatedTrade) {
      throw new Error(`Failed to update trade ${id}`)
    }

    return updatedTrade
  }
}
