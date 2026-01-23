import { ref, computed } from 'vue'
import { portfolioService } from '../PortfolioService'
import type { IPortfolio, IPosition, IPortfolioSummary } from '../types'

export function usePortfolio() {
  const portfolio = ref<IPortfolio | null>(null)
  const positions = ref<IPosition[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalValue = computed(() => {
    if (!portfolio.value) return 0
    return portfolioService.calculateTotalValue(portfolio.value)
  })

  const profitLoss = computed(() => {
    if (!portfolio.value) return { profitLoss: 0, profitLossPercent: 0 }
    return portfolioService.calculateProfitLoss(portfolio.value)
  })

  const summary = computed<IPortfolioSummary | null>(() => {
    if (!portfolio.value) return null

    const sortedByProfit = [...portfolio.value.positions].sort(
      (a, b) => b.profitLossPercent - a.profitLossPercent
    )

    return {
      totalValue: totalValue.value,
      totalCost: portfolio.value.totalCost,
      profitLoss: profitLoss.value.profitLoss,
      profitLossPercent: profitLoss.value.profitLossPercent,
      dayChange: 0,
      dayChangePercent: 0,
      positionsCount: portfolio.value.positions.length,
      topGainer: sortedByProfit[0],
      topLoser: sortedByProfit[sortedByProfit.length - 1]
    }
  })

  const allocation = computed(() => {
    if (!portfolio.value) {
      return {
        byInstrumentType: new Map(),
        bySector: new Map(),
        byExchange: new Map()
      }
    }

    const byInstrumentType = new Map<string, number>()
    const bySector = new Map<string, number>()
    const byExchange = new Map<string, number>()

    portfolio.value.positions.forEach((position) => {
      const value = position.currentValue

      // По типу инструмента
      const type = position.instrumentType
      byInstrumentType.set(type, (byInstrumentType.get(type) || 0) + value)
    })

    return { byInstrumentType, bySector, byExchange }
  })

  const gainers = computed(() => {
    return positions.value.filter((p) => p.profitLoss > 0).sort((a, b) => b.profitLoss - a.profitLoss)
  })

  const losers = computed(() => {
    return positions.value.filter((p) => p.profitLoss < 0).sort((a, b) => a.profitLoss - b.profitLoss)
  })

  async function fetchPortfolio(accountId: number) {
    loading.value = true
    error.value = null
    try {
      portfolio.value = await portfolioService.fetchPortfolio(accountId)
      positions.value = portfolio.value.positions
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch portfolio'
      console.error('Error fetching portfolio:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPositions(accountId: number) {
    loading.value = true
    error.value = null
    try {
      positions.value = await portfolioService.fetchPositions(accountId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch positions'
      console.error('Error fetching positions:', err)
    } finally {
      loading.value = false
    }
  }

  function clearPortfolio() {
    portfolio.value = null
    positions.value = []
  }

  return {
    // State
    portfolio,
    positions,
    loading,
    error,

    // Computed
    totalValue,
    profitLoss,
    summary,
    allocation,
    gainers,
    losers,

    // Methods
    fetchPortfolio,
    fetchPositions,
    clearPortfolio
  }
}
