import type { ICompany } from '@/domains/companies/types'
import type { IInstrument, IStock } from '@/domains/instruments/types'
import type { IAccount, IUser } from '@/domains/accounts/types'
import type { IPortfolio } from '@/domains/portfolio/types'
import type { ITrade } from '@/domains/trades/types'

import { generateCompanies } from '../generators/companiesGenerator'
import { generateInstruments } from '../generators/instrumentsGenerator'
import { generateUser, generateAccounts } from '../generators/accountsGenerator'
import { generatePortfolio } from '../generators/portfolioGenerator'
import { generateTrades } from '../generators/tradesGenerator'

/**
 * Mock Storage
 * Centralized storage for all mock data
 */
export class MockStorage {
  private companies: ICompany[] = []
  private instruments: IInstrument[] = []
  private user: IUser | null = null
  private accounts: IAccount[] = []
  private portfolios: Map<number, IPortfolio> = new Map()
  private trades: ITrade[] = []

  constructor() {
    this.initialize()
  }

  /**
   * Initialize all data
   */
  private initialize(): void {
    console.log('[MockStorage] Initializing mock data...')

    // 1. Generate companies
    this.companies = generateCompanies(100)
    console.log(`[MockStorage] Generated ${this.companies.length} companies`)

    // 2. Generate instruments (акции, ETF, облигации)
    this.instruments = generateInstruments(this.companies, 100, 30, 20)
    console.log(`[MockStorage] Generated ${this.instruments.length} instruments`)

    // 3. Generate user
    this.user = generateUser(1)
    console.log(`[MockStorage] Generated user: ${this.user.username}`)

    // 4. Generate accounts
    this.accounts = generateAccounts(3, this.user.id)
    console.log(`[MockStorage] Generated ${this.accounts.length} accounts`)

    // 5. Generate portfolios для активных аккаунтов
    const activeAccounts = this.accounts.filter((a) => a.status === 'active')
    activeAccounts.forEach((account, index) => {
      const portfolio = generatePortfolio(index + 1, account.id, this.instruments, 10)
      this.portfolios.set(account.id, portfolio)
    })
    console.log(`[MockStorage] Generated ${this.portfolios.size} portfolios`)

    // 6. Generate trade history для первого аккаунта
    if (this.accounts.length > 0) {
      this.trades = generateTrades(50, this.accounts[0].id, this.instruments)
      console.log(`[MockStorage] Generated ${this.trades.length} trades`)
    }

    console.log('[MockStorage] Mock data initialization complete')
  }

  // ============ Companies ============

  getCompanies(): ICompany[] {
    return this.companies
  }

  getCompanyById(id: number): ICompany | undefined {
    return this.companies.find((c) => c.id === id)
  }

  getCompanyByTicker(ticker: string): ICompany | undefined {
    return this.companies.find((c) => c.ticker === ticker)
  }

  searchCompanies(query: string): ICompany[] {
    const lowerQuery = query.toLowerCase()
    return this.companies.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.ticker.toLowerCase().includes(lowerQuery) ||
        c.sector.toLowerCase().includes(lowerQuery)
    )
  }

  // ============ Instruments ============

  getInstruments(): IInstrument[] {
    return this.instruments
  }

  getInstrumentById(id: number): IInstrument | undefined {
    return this.instruments.find((i) => i.id === id)
  }

  getInstrumentByTicker(ticker: string): IInstrument | undefined {
    return this.instruments.find((i) => i.ticker === ticker)
  }

  getInstrumentsByType(type: 'stock' | 'etf' | 'bond'): IInstrument[] {
    return this.instruments.filter((i) => i.type === type)
  }

  getInstrumentsByCompany(companyId: number): IStock[] {
    return this.instruments.filter(
      (i) => i.type === 'stock' && (i as IStock).companyId === companyId
    ) as IStock[]
  }

  searchInstruments(query: string): IInstrument[] {
    const lowerQuery = query.toLowerCase()
    return this.instruments.filter(
      (i) =>
        i.name.toLowerCase().includes(lowerQuery) ||
        i.ticker.toLowerCase().includes(lowerQuery)
    )
  }

  updateInstrumentPrice(id: number, newPrice: number, change: number, changePercent: number): void {
    const instrument = this.getInstrumentById(id)
    if (instrument) {
      instrument.lastPrice = newPrice
      instrument.change = change
      instrument.changePercent = changePercent
    }
  }

  // ============ Accounts ============

  getUser(): IUser | null {
    return this.user
  }

  getAccounts(): IAccount[] {
    return this.accounts
  }

  getAccountById(id: number): IAccount | undefined {
    return this.accounts.find((a) => a.id === id)
  }

  // ============ Portfolio ============

  getPortfolio(accountId: number): IPortfolio | undefined {
    return this.portfolios.get(accountId)
  }

  updatePortfolio(accountId: number, portfolio: IPortfolio): void {
    this.portfolios.set(accountId, portfolio)
  }

  // ============ Trades ============

  getTrades(): ITrade[] {
    return this.trades
  }

  getTradeById(id: number): ITrade | undefined {
    return this.trades.find((t) => t.id === id)
  }

  getTradesByAccount(accountId: number): ITrade[] {
    return this.trades.filter((t) => t.accountId === accountId)
  }

  addTrade(trade: ITrade): void {
    this.trades.unshift(trade)
  }

  updateTrade(id: number, updates: Partial<ITrade>): ITrade | undefined {
    const index = this.trades.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.trades[index] = { ...this.trades[index], ...updates }
      return this.trades[index]
    }
    return undefined
  }
}

export const mockStorage = new MockStorage()
