import { faker } from '@faker-js/faker'
import type { IPortfolio, IPosition } from '@/domains/portfolio/types'
import type { IInstrument } from '@/domains/instruments/types'
import dayjs from 'dayjs'

export function generatePosition(
  id: number,
  portfolioId: number,
  instrument: IInstrument
): IPosition {
  const quantity = faker.number.int({ min: 1, max: 500 })
  const avgPrice = instrument.lastPrice * faker.number.float({ min: 0.8, max: 1.2, fractionDigits: 2 })
  const currentPrice = instrument.lastPrice
  const totalCost = quantity * avgPrice
  const currentValue = quantity * currentPrice
  const profitLoss = currentValue - totalCost
  const profitLossPercent = (profitLoss / totalCost) * 100

  return {
    id,
    portfolioId,
    instrumentId: instrument.id,
    instrumentTicker: instrument.ticker,
    instrumentName: instrument.name,
    instrumentType: instrument.type,
    quantity,
    avgPrice,
    currentPrice,
    totalCost,
    currentValue,
    profitLoss,
    profitLossPercent,
    weight: 0, // Будет рассчитано позже
    updatedAt: dayjs().toISOString()
  }
}

export function generatePortfolio(
  id: number,
  accountId: number,
  instruments: IInstrument[],
  positionsCount: number = 10
): IPortfolio {
  const selectedInstruments = faker.helpers.arrayElements(instruments, positionsCount)
  const positions: IPosition[] = []

  selectedInstruments.forEach((instrument, index) => {
    positions.push(generatePosition(index + 1, id, instrument))
  })

  const totalCost = positions.reduce((sum, pos) => sum + pos.totalCost, 0)
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0)
  const profitLoss = totalValue - totalCost
  const profitLossPercent = (profitLoss / totalCost) * 100
  const cashBalance = faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 })

  // Рассчитываем вес каждой позиции
  positions.forEach((position) => {
    position.weight = (position.currentValue / totalValue) * 100
  })

  return {
    id,
    accountId,
    totalValue: totalValue + cashBalance,
    totalCost,
    profitLoss,
    profitLossPercent,
    cashBalance,
    positions,
    updatedAt: dayjs().toISOString()
  }
}
