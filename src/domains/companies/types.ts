// Company domain types

export interface ICompany {
  id: number
  ticker: string
  name: string
  description: string
  sector: Sector
  industry: string
  country: string
  website: string
  logo?: string
  marketCap: number
  employees: number
  founded: number
  ceo: string
  financials: IFinancials
  createdAt: string
  updatedAt: string
}

export interface IFinancials {
  revenue: number // годовая выручка
  revenueGrowth: number // рост выручки (%)
  profit: number // чистая прибыль
  profitMargin: number // рентабельность (%)
  eps: number // прибыль на акцию
  pe: number // P/E соотношение
  pb: number // P/B соотношение
  dividend: number // дивиденд на акцию
  dividendYield: number // дивидендная доходность (%)
  debtToEquity: number // долг к собственному капиталу
  roe: number // рентабельность собственного капитала (%)
  roa: number // рентабельность активов (%)
}

export type Sector =
  | 'Technology'
  | 'Finance'
  | 'Healthcare'
  | 'Energy'
  | 'Consumer Goods'
  | 'Telecommunications'
  | 'Industrials'
  | 'Materials'
  | 'Utilities'
  | 'Real Estate'

export interface ICompanyFilters {
  sector?: Sector
  minMarketCap?: number
  maxMarketCap?: number
  minRevenue?: number
  maxRevenue?: number
  country?: string
  search?: string
}

export interface ICompanySort {
  field: keyof ICompany | 'financials.revenue' | 'financials.profit' | 'financials.marketCap'
  order: 'asc' | 'desc'
}
