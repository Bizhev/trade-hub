import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'reflect-metadata'

vi.mock('@/shared/api', () => ({
  api: { get: vi.fn() }
}))

import { api } from '@/shared/api'
import { InstrumentsService } from '../InstrumentsService'

const mockGet = vi.mocked(api.get)

const stubStock = { id: 1, ticker: 'AAPL', name: 'Apple Inc.', type: 'stock', companyId: 1, lastPrice: 195 }
const stubEtf = { id: 2, ticker: 'SPY', name: 'S&P 500 ETF', type: 'etf', lastPrice: 500 }
const stubBond = { id: 3, ticker: 'US10Y', name: 'US 10Y Treasury', type: 'bond', lastPrice: 99 }

describe('InstrumentsService', () => {
  let service: InstrumentsService

  beforeEach(() => {
    service = new InstrumentsService()
    vi.clearAllMocks()
  })

  describe('fetchInstruments', () => {
    it('returns all instruments without filters', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock, stubEtf, stubBond] } as never)

      const result = await service.fetchInstruments()

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: undefined })
      expect(result).toHaveLength(3)
    })

    it('passes filters as params', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock] } as never)

      await service.fetchInstruments({ type: 'stock' })

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: { type: 'stock' } })
    })
  })

  describe('fetchStocks', () => {
    it('calls endpoint with type=stock', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock] } as never)

      const result = await service.fetchStocks()

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: { type: 'stock' } })
      expect(result).toEqual([stubStock])
    })
  })

  describe('fetchETFs', () => {
    it('calls endpoint with type=etf', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubEtf] } as never)

      await service.fetchETFs()

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: { type: 'etf' } })
    })
  })

  describe('fetchBonds', () => {
    it('calls endpoint with type=bond', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubBond] } as never)

      await service.fetchBonds()

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: { type: 'bond' } })
    })
  })

  describe('fetchInstrumentById', () => {
    it('fetches by id', async () => {
      mockGet.mockResolvedValueOnce({ data: stubStock } as never)

      const result = await service.fetchInstrumentById(1)

      expect(mockGet).toHaveBeenCalledWith('/api/instruments/1')
      expect(result).toEqual(stubStock)
    })
  })

  describe('fetchInstrumentByTicker', () => {
    it('fetches by ticker', async () => {
      mockGet.mockResolvedValueOnce({ data: stubStock } as never)

      await service.fetchInstrumentByTicker('AAPL')

      expect(mockGet).toHaveBeenCalledWith('/api/instruments/ticker/AAPL')
    })
  })

  describe('fetchInstrumentsByCompany', () => {
    it('fetches stocks for company', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock] } as never)

      await service.fetchInstrumentsByCompany(1)

      expect(mockGet).toHaveBeenCalledWith('/api/instruments', { params: { companyId: 1, type: 'stock' } })
    })
  })

  describe('searchInstruments', () => {
    it('searches without type filter', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock] } as never)

      await service.searchInstruments('apple')

      expect(mockGet).toHaveBeenCalledWith('/api/instruments/search', { params: { q: 'apple', type: undefined } })
    })

    it('searches with type filter', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubStock] } as never)

      await service.searchInstruments('apple', 'stock')

      expect(mockGet).toHaveBeenCalledWith('/api/instruments/search', { params: { q: 'apple', type: 'stock' } })
    })
  })
})
