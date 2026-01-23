import { api } from '@/shared/api'
import type { IPortfolio, IPosition } from './types'

/**
 * Portfolio Domain Service
 * Manages portfolios and positions
 */
export class PortfolioService {
  private static instance: PortfolioService

  private constructor() {}

  static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService()
    }
    return PortfolioService.instance
  }

  /**
   * Get portfolio by account ID
   */
  async fetchPortfolio(accountId: number): Promise<IPortfolio> {
    const { data } = await api.get<IPortfolio>(`/api/portfolio/${accountId}`)
    return data
  }

  /**
   * Get portfolio positions
   */
  async fetchPositions(accountId: number): Promise<IPosition[]> {
    const { data } = await api.get<IPosition[]>(`/api/portfolio/${accountId}/positions`)
    return data
  }

  /**
   * Get position by ID
   */
  async fetchPositionById(positionId: number): Promise<IPosition> {
    const { data } = await api.get<IPosition>(`/api/positions/${positionId}`)
    return data
  }

  /**
   * Calculate total portfolio value
   */
  calculateTotalValue(portfolio: IPortfolio): number {
    const positionsValue = portfolio.positions.reduce(
      (sum, position) => sum + position.currentValue,
      0
    )
    return positionsValue + portfolio.cashBalance
  }

  /**
   * Calculate total profit/loss
   */
  calculateProfitLoss(portfolio: IPortfolio): {
    profitLoss: number
    profitLossPercent: number
  } {
    const totalValue = this.calculateTotalValue(portfolio)
    const profitLoss = totalValue - portfolio.totalCost
    const profitLossPercent = (profitLoss / portfolio.totalCost) * 100

    return { profitLoss, profitLossPercent }
  }
}

export const portfolioService = PortfolioService.getInstance()
