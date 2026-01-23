import { faker } from '@faker-js/faker'
import type { IStock, IETF, IBond, IInstrument, BondRating } from '@/domains/instruments/types'
import type { ICompany } from '@/domains/companies/types'
import dayjs from 'dayjs'

const EXCHANGES = ['NYSE', 'NASDAQ', 'LSE', 'MOEX', 'EURONEXT', 'TSE']
const CURRENCIES = ['USD', 'RUB', 'EUR', 'GBP', 'JPY']

const ETF_CATEGORIES = [
  'Broad Market',
  'Technology',
  'Healthcare',
  'Energy',
  'Bonds',
  'Commodities',
  'International',
  'Small Cap',
  'Dividend'
]

const BOND_RATINGS: BondRating[] = [
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
  'BBB-',
  'BB+',
  'BB'
]

export function generateStock(
  id: number,
  company: ICompany
): IStock {
  const basePrice = faker.number.float({ min: 10, max: 1000, fractionDigits: 2 })
  const change = faker.number.float({ min: -20, max: 20, fractionDigits: 2 })
  const changePercent = (change / basePrice) * 100

  return {
    id,
    type: 'stock',
    ticker: company.ticker,
    name: company.name,
    exchange: faker.helpers.arrayElement(EXCHANGES),
    currency: faker.helpers.arrayElement(CURRENCIES),
    lastPrice: basePrice,
    change,
    changePercent,
    volume: faker.number.int({ min: 100000, max: 50000000 }),
    marketCap: company.marketCap,
    companyId: company.id,
    sector: company.sector,
    industry: company.industry,
    eps: company.financials.eps,
    pe: company.financials.pe,
    dividend: company.financials.dividend,
    dividendYield: company.financials.dividendYield,
    beta: faker.number.float({ min: 0.5, max: 2, fractionDigits: 2 }),
    high52Week: basePrice * faker.number.float({ min: 1.1, max: 1.8 }),
    low52Week: basePrice * faker.number.float({ min: 0.5, max: 0.9 }),
    createdAt: company.createdAt,
    updatedAt: dayjs().toISOString()
  }
}

export function generateETF(id: number): IETF {
  const ticker = faker.string.alpha({ length: 3, casing: 'upper' }) + faker.string.alpha({ length: 1, casing: 'upper' })
  const basePrice = faker.number.float({ min: 20, max: 500, fractionDigits: 2 })
  const change = faker.number.float({ min: -10, max: 10, fractionDigits: 2 })
  const changePercent = (change / basePrice) * 100

  return {
    id,
    type: 'etf',
    ticker,
    name: `${faker.company.name()} ETF`,
    exchange: faker.helpers.arrayElement(EXCHANGES),
    currency: 'USD',
    lastPrice: basePrice,
    change,
    changePercent,
    volume: faker.number.int({ min: 500000, max: 20000000 }),
    marketCap: faker.number.float({ min: 100_000_000, max: 50_000_000_000 }),
    category: faker.helpers.arrayElement(ETF_CATEGORIES),
    holdings: faker.number.int({ min: 50, max: 3000 }),
    expenseRatio: faker.number.float({ min: 0.03, max: 1.5, fractionDigits: 2 }),
    aum: faker.number.float({ min: 100_000_000, max: 100_000_000_000 }),
    inceptionDate: dayjs()
      .subtract(faker.number.int({ min: 1, max: 30 }), 'year')
      .toISOString(),
    ytdReturn: faker.number.float({ min: -15, max: 40, fractionDigits: 2 }),
    threeYearReturn: faker.number.float({ min: -5, max: 60, fractionDigits: 2 }),
    fiveYearReturn: faker.number.float({ min: 0, max: 120, fractionDigits: 2 }),
    createdAt: dayjs().subtract(faker.number.int({ min: 30, max: 365 }), 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  }
}

export function generateBond(id: number): IBond {
  const ticker = faker.string.alpha({ length: 4, casing: 'upper' }) + faker.number.int({ min: 10, max: 40 })
  const faceValue = 1000
  const couponRate = faker.number.float({ min: 1, max: 8, fractionDigits: 2 })
  const basePrice = faker.number.float({ min: 95, max: 105, fractionDigits: 2 })
  const change = faker.number.float({ min: -2, max: 2, fractionDigits: 2 })
  const changePercent = (change / basePrice) * 100

  return {
    id,
    type: 'bond',
    ticker,
    name: `${faker.company.name()} Bond`,
    exchange: faker.helpers.arrayElement(EXCHANGES),
    currency: 'USD',
    lastPrice: basePrice,
    change,
    changePercent,
    volume: faker.number.int({ min: 10000, max: 1000000 }),
    issuer: faker.company.name(),
    couponRate,
    maturityDate: dayjs()
      .add(faker.number.int({ min: 1, max: 30 }), 'year')
      .toISOString(),
    faceValue,
    yieldToMaturity: faker.number.float({ min: 1.5, max: 10, fractionDigits: 2 }),
    rating: faker.helpers.arrayElement(BOND_RATINGS),
    duration: faker.number.float({ min: 1, max: 15, fractionDigits: 2 }),
    createdAt: dayjs().subtract(faker.number.int({ min: 30, max: 365 }), 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  }
}

export function generateInstruments(
  companies: ICompany[],
  stocksCount: number = 100,
  etfsCount: number = 50,
  bondsCount: number = 50
): IInstrument[] {
  const instruments: IInstrument[] = []

  // Генерация акций на основе компаний
  companies.slice(0, stocksCount).forEach((company, index) => {
    instruments.push(generateStock(index + 1, company))
  })

  // Генерация ETF
  for (let i = 0; i < etfsCount; i++) {
    instruments.push(generateETF(stocksCount + i + 1))
  }

  // Генерация облигаций
  for (let i = 0; i < bondsCount; i++) {
    instruments.push(generateBond(stocksCount + etfsCount + i + 1))
  }

  return instruments
}
