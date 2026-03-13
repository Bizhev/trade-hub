import { injectable } from 'inversify'
import { api } from '@/shared/api'
import type { IInstrument, IStock, IETF, IBond, InstrumentType, IInstrumentFilters } from './types'

@injectable()
export class InstrumentsService {
  async fetchInstruments(filters?: IInstrumentFilters): Promise<IInstrument[]> {
    const { data } = await api.get<IInstrument[]>('/api/instruments', { params: filters })
    return data
  }

  async fetchStocks(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IStock[]> {
    const { data } = await api.get<IStock[]>('/api/instruments', { params: { ...filters, type: 'stock' } })
    return data
  }

  async fetchETFs(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IETF[]> {
    const { data } = await api.get<IETF[]>('/api/instruments', { params: { ...filters, type: 'etf' } })
    return data
  }

  async fetchBonds(filters?: Omit<IInstrumentFilters, 'type'>): Promise<IBond[]> {
    const { data } = await api.get<IBond[]>('/api/instruments', { params: { ...filters, type: 'bond' } })
    return data
  }

  async fetchInstrumentById(id: number): Promise<IInstrument> {
    const { data } = await api.get<IInstrument>(`/api/instruments/${id}`)
    return data
  }

  async fetchInstrumentByTicker(ticker: string): Promise<IInstrument> {
    const { data } = await api.get<IInstrument>(`/api/instruments/ticker/${ticker}`)
    return data
  }

  async fetchInstrumentsByCompany(companyId: number): Promise<IStock[]> {
    const { data } = await api.get<IStock[]>('/api/instruments', { params: { companyId, type: 'stock' } })
    return data
  }

  async searchInstruments(query: string, type?: InstrumentType): Promise<IInstrument[]> {
    const { data } = await api.get<IInstrument[]>('/api/instruments/search', { params: { q: query, type } })
    return data
  }
}
