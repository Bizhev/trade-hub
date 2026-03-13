import { injectable } from 'inversify'
import { api } from '@/shared/api'
import type { IPortfolio, IPosition } from './types'

@injectable()
export class PortfolioService {
  async fetchPortfolio(accountId: number): Promise<IPortfolio> {
    const { data } = await api.get<IPortfolio>(`/api/portfolio/${accountId}`)
    return data
  }

  async fetchPositions(accountId: number): Promise<IPosition[]> {
    const { data } = await api.get<IPosition[]>(`/api/portfolio/${accountId}/positions`)
    return data
  }

  async fetchPositionById(positionId: number): Promise<IPosition> {
    const { data } = await api.get<IPosition>(`/api/positions/${positionId}`)
    return data
  }

  calculateTotalValue(portfolio: IPortfolio): number {
    return portfolio.positions.reduce((sum, p) => sum + p.currentValue, 0) + portfolio.cashBalance
  }

  calculateProfitLoss(portfolio: IPortfolio): { profitLoss: number; profitLossPercent: number } {
    const totalValue = this.calculateTotalValue(portfolio)
    const profitLoss = totalValue - portfolio.totalCost
    return { profitLoss, profitLossPercent: (profitLoss / portfolio.totalCost) * 100 }
  }
}
