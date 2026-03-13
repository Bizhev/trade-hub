import { injectable } from 'inversify'
import { api } from '@/shared/api'
import type { ITrade, ICreateTradeRequest, ITradeFilters } from './types'

@injectable()
export class TradesService {
  async fetchTrades(filters?: ITradeFilters): Promise<ITrade[]> {
    const { data } = await api.get<ITrade[]>('/api/trades', { params: filters })
    return data
  }

  async fetchTradesByAccount(accountId: number): Promise<ITrade[]> {
    const { data } = await api.get<ITrade[]>('/api/trades', { params: { accountId } })
    return data
  }

  async fetchTradeById(id: number): Promise<ITrade> {
    const { data } = await api.get<ITrade>(`/api/trades/${id}`)
    return data
  }

  async createTrade(request: ICreateTradeRequest): Promise<ITrade> {
    const { data } = await api.post<ITrade>('/api/trades', request)
    return data
  }

  async cancelTrade(id: number): Promise<ITrade> {
    const { data } = await api.delete<ITrade>(`/api/trades/${id}`)
    return data
  }
}
