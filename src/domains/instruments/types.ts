// Instruments domain types

export type InstrumentType = 'stock' | 'etf' | 'bond'

export interface IInstrument {
  id: number
  type: InstrumentType
  ticker: string
  name: string
  exchange: string
  currency: string
  lastPrice: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  createdAt: string
  updatedAt: string
}

export interface IStock extends IInstrument {
  type: 'stock'
  companyId: number
  sector: string
  industry: string
  eps: number
  pe: number
  dividend: number
  dividendYield: number
  beta: number
  high52Week: number
  low52Week: number
}

export interface IETF extends IInstrument {
  type: 'etf'
  category: string
  holdings: number
  expenseRatio: number
  aum: number // Assets Under Management
  inceptionDate: string
  ytdReturn: number
  threeYearReturn: number
  fiveYearReturn: number
}

export interface IBond extends IInstrument {
  type: 'bond'
  issuer: string
  couponRate: number
  maturityDate: string
  faceValue: number
  yieldToMaturity: number
  rating: BondRating
  duration: number
}

export type BondRating =
  | 'AAA'
  | 'AA+'
  | 'AA'
  | 'AA-'
  | 'A+'
  | 'A'
  | 'A-'
  | 'BBB+'
  | 'BBB'
  | 'BBB-'
  | 'BB+'
  | 'BB'
  | 'BB-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'CCC'
  | 'CC'
  | 'C'
  | 'D'

export interface IInstrumentFilters {
  type?: InstrumentType
  exchange?: string
  sector?: string
  minPrice?: number
  maxPrice?: number
  minVolume?: number
  search?: string
}

export interface IQuote {
  instrumentId: number
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}
