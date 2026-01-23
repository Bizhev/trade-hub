import { faker } from '@faker-js/faker'
import type { ICompany, IFinancials, Sector } from '@/domains/companies/types'
import dayjs from 'dayjs'

// Реальные тикеры крупных компаний
const TICKERS = [
  // US Tech
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META',
  'TSLA', 'NVDA', 'AMD', 'INTC', 'ORCL',
  'NFLX', 'ADBE', 'CRM', 'CSCO', 'PYPL',

  // US Finance
  'JPM', 'BAC', 'WFC', 'GS', 'MS',
  'C', 'BLK', 'SCHW', 'AXP', 'V',

  // US Healthcare
  'JNJ', 'UNH', 'PFE', 'ABBV', 'TMO',
  'MRK', 'ABT', 'DHR', 'BMY', 'LLY',

  // Russian
  'GAZP', 'SBER', 'LKOH', 'ROSN', 'GMKN',
  'NVTK', 'MGNT', 'TATN', 'SNGS', 'MTSS',

  // European
  'ASML', 'SAP', 'SHEL', 'HSBA', 'NVO',
  'TTE', 'OR', 'MC', 'SAN', 'BNP'
]

const SECTORS: Sector[] = [
  'Technology',
  'Finance',
  'Healthcare',
  'Energy',
  'Consumer Goods',
  'Telecommunications',
  'Industrials',
  'Materials',
  'Utilities',
  'Real Estate'
]

const INDUSTRIES_BY_SECTOR: Record<Sector, string[]> = {
  Technology: [
    'Software',
    'Hardware',
    'Semiconductors',
    'Cloud Computing',
    'Cybersecurity',
    'AI & Machine Learning'
  ],
  Finance: [
    'Banking',
    'Insurance',
    'Investment Management',
    'Fintech',
    'Private Equity'
  ],
  Healthcare: [
    'Pharmaceuticals',
    'Biotechnology',
    'Medical Devices',
    'Healthcare Services',
    'Diagnostics'
  ],
  Energy: ['Oil & Gas', 'Renewable Energy', 'Utilities', 'Energy Services'],
  'Consumer Goods': [
    'Retail',
    'Food & Beverage',
    'Apparel',
    'E-commerce',
    'Consumer Electronics'
  ],
  Telecommunications: ['Wireless', 'Broadband', 'Satellite', '5G Infrastructure'],
  Industrials: ['Manufacturing', 'Aerospace', 'Defense', 'Construction', 'Logistics'],
  Materials: ['Mining', 'Chemicals', 'Steel', 'Paper & Packaging'],
  Utilities: ['Electric', 'Gas', 'Water', 'Waste Management'],
  'Real Estate': ['Residential', 'Commercial', 'REITs', 'Property Management']
}

const COUNTRIES = ['USA', 'Russia', 'Germany', 'UK', 'France', 'Netherlands', 'Switzerland']

function generateFinancials(marketCap: number): IFinancials {
  const revenue = marketCap * faker.number.float({ min: 0.3, max: 1.5 })
  const profitMargin = faker.number.float({ min: 5, max: 35 })
  const profit = revenue * (profitMargin / 100)
  const eps = faker.number.float({ min: 0.5, max: 50, fractionDigits: 2 })
  const pe = faker.number.float({ min: 8, max: 40, fractionDigits: 2 })
  const pb = faker.number.float({ min: 0.8, max: 8, fractionDigits: 2 })
  const dividend = faker.number.float({ min: 0, max: 5, fractionDigits: 2 })
  const dividendYield = faker.number.float({ min: 0, max: 6, fractionDigits: 2 })

  return {
    revenue,
    revenueGrowth: faker.number.float({ min: -10, max: 50, fractionDigits: 2 }),
    profit,
    profitMargin,
    eps,
    pe,
    pb,
    dividend,
    dividendYield,
    debtToEquity: faker.number.float({ min: 0.1, max: 2.5, fractionDigits: 2 }),
    roe: faker.number.float({ min: 5, max: 30, fractionDigits: 2 }),
    roa: faker.number.float({ min: 2, max: 20, fractionDigits: 2 })
  }
}

export function generateCompany(
  id: number,
  ticker?: string,
  sector?: Sector
): ICompany {
  const selectedTicker = ticker || faker.helpers.arrayElement(TICKERS)
  const selectedSector = sector || faker.helpers.arrayElement(SECTORS)
  const industry = faker.helpers.arrayElement(INDUSTRIES_BY_SECTOR[selectedSector])
  const country = faker.helpers.arrayElement(COUNTRIES)
  const marketCap = faker.number.float({
    min: 1_000_000_000,
    max: 3_000_000_000_000,
    fractionDigits: 0
  })

  return {
    id,
    ticker: selectedTicker,
    name: faker.company.name(),
    description: faker.company.catchPhrase() + '. ' + faker.lorem.paragraph(),
    sector: selectedSector,
    industry,
    country,
    website: faker.internet.url(),
    logo: `https://logo.clearbit.com/${faker.internet.domainName()}`,
    marketCap,
    employees: faker.number.int({ min: 100, max: 500000 }),
    founded: faker.number.int({ min: 1950, max: 2020 }),
    ceo: faker.person.fullName(),
    financials: generateFinancials(marketCap),
    createdAt: dayjs().subtract(faker.number.int({ min: 30, max: 365 }), 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  }
}

export function generateCompanies(count: number = 100): ICompany[] {
  const companies: ICompany[] = []

  // Сначала генерируем компании с реальными тикерами
  const tickersToUse = TICKERS.slice(0, Math.min(count, TICKERS.length))
  tickersToUse.forEach((ticker, index) => {
    companies.push(generateCompany(index + 1, ticker))
  })

  // Если нужно больше компаний, генерируем со случайными тикерами
  for (let i = tickersToUse.length; i < count; i++) {
    const randomTicker = faker.string.alpha({ length: 4, casing: 'upper' })
    companies.push(generateCompany(i + 1, randomTicker))
  }

  return companies
}
