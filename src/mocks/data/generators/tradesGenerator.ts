import { faker } from '@faker-js/faker'
import type { ITrade, TradeType, TradeSide, TradeStatus } from '@/domains/trades/types'
import type { IInstrument } from '@/domains/instruments/types'
import dayjs from 'dayjs'

const TRADE_TYPES: TradeType[] = ['market', 'limit', 'stop', 'stop-limit']
const TRADE_SIDES: TradeSide[] = ['buy', 'sell']

export function generateTrade(
  id: number,
  accountId: number,
  instrument: IInstrument
): ITrade {
  const side = faker.helpers.arrayElement(TRADE_SIDES)
  const type = faker.helpers.arrayElement(TRADE_TYPES)
  const status = faker.helpers.weightedArrayElement([
    { value: 'executed', weight: 0.8 },
    { value: 'pending', weight: 0.1 },
    { value: 'cancelled', weight: 0.1 }
  ]) as TradeStatus

  const quantity = faker.number.int({ min: 1, max: 100 })
  const price = instrument.lastPrice * faker.number.float({ min: 0.95, max: 1.05, fractionDigits: 2 })
  const totalAmount = quantity * price
  const commission = totalAmount * 0.001 // 0.1% комиссия

  const daysAgo = faker.number.int({ min: 1, max: 365 })

  return {
    id,
    accountId,
    instrumentId: instrument.id,
    instrumentTicker: instrument.ticker,
    instrumentName: instrument.name,
    type,
    side,
    quantity,
    price,
    totalAmount,
    commission,
    status,
    executedAt: status === 'executed'
      ? dayjs().subtract(daysAgo, 'day').toISOString()
      : undefined,
    createdAt: dayjs().subtract(daysAgo, 'day').toISOString()
  }
}

export function generateTrades(
  count: number = 100,
  accountId: number,
  instruments: IInstrument[]
): ITrade[] {
  const trades: ITrade[] = []

  for (let i = 0; i < count; i++) {
    const instrument = faker.helpers.arrayElement(instruments)
    trades.push(generateTrade(i + 1, accountId, instrument))
  }

  // Сортировка по дате создания (новые сверху)
  return trades.sort((a, b) =>
    dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
  )
}
