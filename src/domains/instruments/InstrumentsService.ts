import { api } from '@/shared/api'
import type { IInstrument, IStock, IETF, IBond, InstrumentType, IInstrumentFilters } from './types'

/**
 * Instruments Domain Service
 * Manages financial instruments (stocks, ETF, bonds)
 */
export class InstrumentsService {
  private static instance: InstrumentsService

  private constructor() {}

  static getInstance(): InstrumentsService {
    if (!InstrumentsService.instance) {
      InstrumentsService.instance = new InstrumentsService()
    }
    return InstrumentsService.instance
  }

  /**
   * Get list of instruments
   */
  async fetchInstruments(filters?: IInstrumentFilters): Promise<IInstrument[]> {
    const { data } = await api.get<IInstrument[]>('/api/instruments', {
      params: filters
    })
    return data
  }

  /**
   * Get stocks
   */
  async fetchStocks(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IStock[]> {
    const { data } = await api.get<IStock[]>('/api/instruments', {
      params: { ...filters, type: 'stock' }
    })
    return data
  }

  /**
   * Get ETFs
   */
  async fetchETFs(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IETF[]> {
    const { data } = await api.get<IETF[]>('/api/instruments', {
      params: { ...filters, type: 'etf' }
    })
    return data
  }

  /**
   * Get bonds
   */
  async fetchBonds(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IBond[]> {
    const { data } = await api.get<IBond[]>('/api/instruments', {
      params: { ...filters, type: 'bond' }
    })
    return data
  }

  /**
   * Get instrument by ID
   */
  async fetchInstrumentById(id: number): Promise<IInstrument> {
    const { data } = await api.get<IInstrument>(`/api/instruments/${id}`)
    return data
  }

  /**
   * Get instrument by ticker
   */
  async fetchInstrumentByTicker(ticker: string): Promise<IInstrument> {
    const { data } = await api.get<IInstrument>(`/api/instruments/ticker/${ticker}`)
    return data
  }

  /**
   * Get company instruments
   */
  async fetchInstrumentsByCompany(companyId: number): Promise<IStock[]> {
    const { data } = await api.get<IStock[]>('/api/instruments', {
      params: { companyId, type: 'stock' }
    })
    return data
  }

  /**
   * Search instruments
   */
  async searchInstruments(query: string, type?: InstrumentType): Promise<IInstrument[]> {
    const { data } = await api.get<IInstrument[]>('/api/instruments/search', {
      params: { q: query, type }
    })
    return data
  }
}

export const instrumentsService = InstrumentsService.getInstance()
