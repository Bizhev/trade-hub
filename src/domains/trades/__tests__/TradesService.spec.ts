import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'reflect-metadata'

vi.mock('@/shared/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() }
}))

import { api } from '@/shared/api'
import { TradesService } from '../TradesService'

const mockGet = vi.mocked(api.get)
const mockPost = vi.mocked(api.post)
const mockDelete = vi.mocked(api.delete)

const stubTrade = {
  id: 1, accountId: 10, instrumentId: 1, instrumentTicker: 'AAPL',
  instrumentName: 'Apple', type: 'market', side: 'buy', quantity: 5,
  price: 195, totalAmount: 975, commission: 0.975, status: 'executed',
  createdAt: '2024-01-01'
}

describe('TradesService', () => {
  let service: TradesService

  beforeEach(() => {
    service = new TradesService()
    vi.clearAllMocks()
  })

  describe('fetchTrades', () => {
    it('returns all trades without filters', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubTrade] } as never)

      const result = await service.fetchTrades()

      expect(mockGet).toHaveBeenCalledWith('/api/trades', { params: undefined })
      expect(result).toEqual([stubTrade])
    })

    it('passes filters as params', async () => {
      mockGet.mockResolvedValueOnce({ data: [] } as never)

      await service.fetchTrades({ accountId: 10 })

      expect(mockGet).toHaveBeenCalledWith('/api/trades', { params: { accountId: 10 } })
    })
  })

  describe('fetchTradesByAccount', () => {
    it('fetches trades for specific account', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubTrade] } as never)

      await service.fetchTradesByAccount(10)

      expect(mockGet).toHaveBeenCalledWith('/api/trades', { params: { accountId: 10 } })
    })
  })

  describe('fetchTradeById', () => {
    it('fetches by id', async () => {
      mockGet.mockResolvedValueOnce({ data: stubTrade } as never)

      const result = await service.fetchTradeById(1)

      expect(mockGet).toHaveBeenCalledWith('/api/trades/1')
      expect(result).toEqual(stubTrade)
    })
  })

  describe('createTrade', () => {
    it('posts trade request and returns created trade', async () => {
      mockPost.mockResolvedValueOnce({ data: stubTrade } as never)
      const request = { accountId: 10, instrumentId: 1, type: 'market', side: 'buy', quantity: 5 }

      const result = await service.createTrade(request as never)

      expect(mockPost).toHaveBeenCalledWith('/api/trades', request)
      expect(result).toEqual(stubTrade)
    })
  })

  describe('cancelTrade', () => {
    it('sends DELETE and returns updated trade', async () => {
      const cancelled = { ...stubTrade, status: 'cancelled' }
      mockDelete.mockResolvedValueOnce({ data: cancelled } as never)

      const result = await service.cancelTrade(1)

      expect(mockDelete).toHaveBeenCalledWith('/api/trades/1')
      expect(result.status).toBe('cancelled')
    })
  })
})
