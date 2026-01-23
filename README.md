# Company Info for Investors

Platform with company information for investors.

## Architecture

**Domain Services** - enterprise architecture with domain services and composables.

### Project Structure

```
src/
├── domains/                      # Domain Services
│   ├── companies/                # Companies
│   │   ├── CompaniesService.ts
│   │   ├── types.ts
│   │   └── composables/
│   │       └── useCompanies.ts
│   ├── instruments/              # Financial Instruments (Stock, ETF, Bonds)
│   │   ├── InstrumentsService.ts
│   │   ├── types.ts
│   │   └── composables/
│   │       └── useInstruments.ts
│   ├── portfolio/                # Portfolios
│   │   ├── PortfolioService.ts
│   │   ├── types.ts
│   │   └── composables/
│   │       └── usePortfolio.ts
│   ├── accounts/                 # Accounts & Authentication
│   │   ├── AccountsService.ts
│   │   ├── types.ts
│   │   └── composables/
│   │       └── useAccounts.ts
│   └── trades/                   # Trades
│       ├── TradesService.ts
│       ├── types.ts
│       └── composables/
│           └── useTrades.ts
├── mocks/                        # Mock Data
│   ├── data/
│   │   ├── generators/           # Data generators with @faker-js/faker
│   │   │   ├── companiesGenerator.ts
│   │   │   ├── instrumentsGenerator.ts
│   │   │   ├── portfolioGenerator.ts
│   │   │   ├── accountsGenerator.ts
│   │   │   └── tradesGenerator.ts
│   │   └── storage/
│   │       └── mockStorage.ts   # Centralized storage
│   └── api/
│       └── mockApiClient.ts     # REST API emulation
├── shared/                       # Shared modules
│   ├── api/
│   │   └── httpClient.ts        # HTTP client with mock/real API support
│   ├── config/
│   │   └── environment.ts       # Environment configuration
│   └── ui/                       # UI components
├── modules/
│   └── pages/                    # Pages
│       ├── company/
│       ├── accounts/
│       └── login/
└── app/                          # Application configuration
```

## Tech Stack

- **Vue 3.4** - Composition API
- **TypeScript 5.4** - Strict typing
- **Quasar 2.16** - UI Framework
- **Pinia 2.1** - State Management
- **Axios 1.7** - HTTP Client
- **dayjs 1.11** - Date manipulation
- **@faker-js/faker 9.3** - Mock data generation

### Testing

- **Vitest 1.6** - Unit tests
- **Cypress 13.12** - E2E tests
- **@vue/test-utils 2.4** - Vue component testing

## Installation and Running

### Install dependencies

```bash
npm install
```

### Development mode (with mock data)

```bash
npm run dev
```

Application will be available at http://localhost:5173

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Testing

### Unit tests

```bash
npm run test:unit
```

### E2E tests

```bash
# Development mode (interactive)
npm run test:e2e:dev

# CI mode
npm run test:e2e
```

## Switching between Mock and Real API

### Development (.env.development)

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=
```

### Production (.env.production)

```env
VITE_USE_MOCK_API=true  # For GitHub Pages
VITE_API_BASE_URL=
```

### Using Real API

Modify `.env.development`:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://your-api.com
```

## Domain Entities

### Companies

- List of companies with financial metrics
- Search by ticker/name
- Filter by sectors
- Market Cap, Revenue, P/E, Dividend, etc.

### Instruments (Financial Instruments)

- **Stocks** - Company shares
- **ETF** - Exchange-traded funds
- **Bonds** - Fixed-income securities

### Portfolio

- User portfolios
- Instrument positions
- Profit/Loss calculations
- Asset allocation

### Accounts

- Account management
- Authentication
- Account balances

### Trades

- Trade history
- Create new orders
- Market, Limit, Stop orders

## Mock Data

The project uses realistic mock data for demonstration:

- **100 companies** - including real tickers (AAPL, GOOGL, MSFT, GAZP, SBER, etc.)
- **150 instruments** - 100 stocks, 30 ETFs, 20 bonds
- **3 user accounts**
- **10 portfolio positions**
- **50 trade history**

Data is generated automatically on app load using @faker-js/faker.

## Implementation Features

### Singleton Pattern for Services

```typescript
export class CompaniesService {
  private static instance: CompaniesService

  static getInstance(): CompaniesService {
    if (!CompaniesService.instance) {
      CompaniesService.instance = new CompaniesService()
    }
    return CompaniesService.instance
  }
}
```

### Composables for Logic Reuse

```typescript
export function useCompanies() {
  const companies = ref<ICompany[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompanies() {
    loading.value = true
    try {
      companies.value = await companiesService.fetchCompanies()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { companies, loading, error, fetchCompanies }
}
```

### Automatic API Switching

```typescript
export const api = environment.useMockApi ? createMockApiClient() : createRealApiClient()
```

## Roadmap

- [ ] Add Portfolio page
- [ ] Add Instruments page
- [ ] Add Trades page
- [ ] Add charts with Chart.js
- [ ] Add filters and sorting
- [ ] Add detailed company pages
- [ ] Add real-time price updates
- [ ] Setup GitHub Pages deployment
- [ ] Add more unit tests
- [ ] Add E2E tests for all pages

## License

MIT

## Author

Dolet Bizhev - Software Architect / Senior Frontend Developer
