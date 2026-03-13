import 'reflect-metadata'
import { Container } from 'inversify'
import { CompaniesService } from '@/domains/companies/CompaniesService'
import { InstrumentsService } from '@/domains/instruments/InstrumentsService'
import { AccountsService } from '@/domains/accounts/AccountsService'
import { PortfolioService } from '@/domains/portfolio/PortfolioService'
import { TradesService } from '@/domains/trades/TradesService'

/**
 * Dependency Injection tokens — string keys for service resolution.
 * Using symbols prevents accidental collisions between tokens.
 */
export const TOKENS = {
  CompaniesService: Symbol.for('CompaniesService'),
  InstrumentsService: Symbol.for('InstrumentsService'),
  AccountsService: Symbol.for('AccountsService'),
  PortfolioService: Symbol.for('PortfolioService'),
  TradesService: Symbol.for('TradesService')
} as const

/**
 * IoC Container — single source of truth for service instantiation.
 *
 * Why DI instead of singletons or stores:
 * - Services are registered once as singletons and resolved lazily
 * - Easy to swap implementations (real vs mock) without touching consumers
 * - Easy to mock in unit tests: rebind(TOKENS.CompaniesService).toConstantValue(mockService)
 */
const container = new Container()

container.bind<CompaniesService>(TOKENS.CompaniesService).to(CompaniesService).inSingletonScope()
container.bind<InstrumentsService>(TOKENS.InstrumentsService).to(InstrumentsService).inSingletonScope()
container.bind<AccountsService>(TOKENS.AccountsService).to(AccountsService).inSingletonScope()
container.bind<PortfolioService>(TOKENS.PortfolioService).to(PortfolioService).inSingletonScope()
container.bind<TradesService>(TOKENS.TradesService).to(TradesService).inSingletonScope()

export { container }
