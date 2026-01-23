import { api } from '@/shared/api'
import type { ITrade, ICreateTradeRequest, ITradeFilters } from './types'

/**
 * Trades Domain Service
 * Manages trades (history and creation)
 */
export class TradesService {
  private static instance: TradesService

  private constructor() {}

  static getInstance(): TradesService {
    if (!TradesService.instance) {
      TradesService.instance = new TradesService()
    }
    return TradesService.instance
  }

  /**
   * Get trade history
   */
  async fetchTrades(filters?: ITradeFilters): Promise<ITrade[]> {
    const { data } = await api.get<ITrade[]>('/api/trades', {
      params: filters
    })
    return data
  }

  /**
   * Get trades by account
   */
  async fetchTradesByAccount(accountId: number): Promise<ITrade[]> {
    const { data } = await api.get<ITrade[]>('/api/trades', {
      params: { accountId }
    })
    return data
  }

  /**
   * Get trade by ID
   */
  async fetchTradeById(id: number): Promise<ITrade> {
    const { data } = await api.get<ITrade>(`/api/trades/${id}`)
    return data
  }

  /**
   * Create new trade
   */
  async createTrade(request: ICreateTradeRequest): Promise<ITrade> {
    const { data } = await api.post<ITrade>('/api/trades', request)
    return data
  }

  /**
   * Cancel trade
   */
  async cancelTrade(id: number): Promise<ITrade> {
    const { data } = await api.delete<ITrade>(`/api/trades/${id}`)
    return data
  }
}

export const tradesService = TradesService.getInstance()
