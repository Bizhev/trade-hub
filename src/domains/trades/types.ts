// Trades domain types

export interface ITrade {
  id: number
  accountId: number
  instrumentId: number
  instrumentTicker: string
  instrumentName: string
  type: TradeType
  side: TradeSide
  quantity: number
  price: number
  totalAmount: number
  commission: number
  status: TradeStatus
  executedAt?: string
  createdAt: string
}

export type TradeType = 'market' | 'limit' | 'stop' | 'stop-limit'

export type TradeSide = 'buy' | 'sell'

export type TradeStatus = 'pending' | 'executed' | 'cancelled' | 'rejected' | 'partial'

export interface ICreateTradeRequest {
  accountId: number
  instrumentId: number
  type: TradeType
  side: TradeSide
  quantity: number
  price?: number // Для limit/stop ордеров
  stopPrice?: number // Для stop/stop-limit ордеров
}

export interface ITradeFilters {
  accountId?: number
  instrumentId?: number
  side?: TradeSide
  status?: TradeStatus
  dateFrom?: string
  dateTo?: string
}

export interface ITradeStats {
  totalTrades: number
  totalBuys: number
  totalSells: number
  totalVolume: number
  totalCommission: number
  averageTradeSize: number
}
