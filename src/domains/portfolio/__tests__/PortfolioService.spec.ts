import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'reflect-metadata'

vi.mock('@/shared/api', () => ({
  api: { get: vi.fn() }
}))

import { api } from '@/shared/api'
import { PortfolioService } from '../PortfolioService'
import type { IPortfolio } from '../types'

const mockGet = vi.mocked(api.get)

const stubPosition = {
  id: 1, portfolioId: 1, instrumentId: 1, instrumentTicker: 'AAPL', instrumentName: 'Apple',
  instrumentType: 'stock' as const, quantity: 10, avgPrice: 180, currentPrice: 195,
  currentValue: 1950, totalCost: 1800, profitLoss: 150, profitLossPercent: 8.3,
  weight: 20, updatedAt: '2024-01-01'
}

const stubPortfolio: IPortfolio = {
  id: 1, accountId: 10, totalValue: 10000, totalCost: 9000,
  profitLoss: 1000, profitLossPercent: 11.1, cashBalance: 1500,
  positions: [stubPosition], updatedAt: '2024-01-01'
}

describe('PortfolioService', () => {
  let service: PortfolioService

  beforeEach(() => {
    service = new PortfolioService()
    vi.clearAllMocks()
  })

  describe('fetchPortfolio', () => {
    it('fetches portfolio by accountId', async () => {
      mockGet.mockResolvedValueOnce({ data: stubPortfolio } as never)

      const result = await service.fetchPortfolio(10)

      expect(mockGet).toHaveBeenCalledWith('/api/portfolio/10')
      expect(result).toEqual(stubPortfolio)
    })
  })

  describe('fetchPositions', () => {
    it('fetches positions by accountId', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubPosition] } as never)

      const result = await service.fetchPositions(10)

      expect(mockGet).toHaveBeenCalledWith('/api/portfolio/10/positions')
      expect(result).toEqual([stubPosition])
    })
  })

  describe('fetchPositionById', () => {
    it('fetches position by id', async () => {
      mockGet.mockResolvedValueOnce({ data: stubPosition } as never)

      const result = await service.fetchPositionById(1)

      expect(mockGet).toHaveBeenCalledWith('/api/positions/1')
      expect(result).toEqual(stubPosition)
    })
  })

  describe('calculateTotalValue', () => {
    it('sums position currentValues plus cashBalance', () => {
      const result = service.calculateTotalValue(stubPortfolio)
      // positions[0].currentValue(1950) + cashBalance(1500) = 3450
      expect(result).toBe(3450)
    })
  })

  describe('calculateProfitLoss', () => {
    it('returns profitLoss and profitLossPercent', () => {
      const { profitLoss, profitLossPercent } = service.calculateProfitLoss(stubPortfolio)
      // totalValue = 3450, totalCost = 9000 => profitLoss = -5550
      expect(profitLoss).toBeCloseTo(-5550)
      expect(profitLossPercent).toBeCloseTo((-5550 / 9000) * 100)
    })
  })
})
