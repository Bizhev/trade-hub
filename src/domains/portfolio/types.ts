// Portfolio domain types

export interface IPortfolio {
  id: number
  accountId: number
  totalValue: number
  totalCost: number
  profitLoss: number
  profitLossPercent: number
  cashBalance: number
  positions: IPosition[]
  updatedAt: string
}

export interface IPosition {
  id: number
  portfolioId: number
  instrumentId: number
  instrumentTicker: string
  instrumentName: string
  instrumentType: 'stock' | 'etf' | 'bond'
  quantity: number
  avgPrice: number
  currentPrice: number
  totalCost: number
  currentValue: number
  profitLoss: number
  profitLossPercent: number
  weight: number // доля в портфеле (%)
  updatedAt: string
}

export interface IPortfolioSummary {
  totalValue: number
  totalCost: number
  profitLoss: number
  profitLossPercent: number
  dayChange: number
  dayChangePercent: number
  positionsCount: number
  topGainer?: IPosition
  topLoser?: IPosition
}

export interface IAllocation {
  byInstrumentType: Map<string, number>
  bySector: Map<string, number>
  byExchange: Map<string, number>
}
