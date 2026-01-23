import { ref, computed } from 'vue'
import { tradesService } from '../TradesService'
import type { ITrade, ICreateTradeRequest, ITradeFilters, ITradeStats } from '../types'

export function useTrades() {
  const trades = ref<ITrade[]>([])
  const selectedTrade = ref<ITrade | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const buyTrades = computed(() => trades.value.filter((t) => t.side === 'buy'))
  const sellTrades = computed(() => trades.value.filter((t) => t.side === 'sell'))

  const executedTrades = computed(() => trades.value.filter((t) => t.status === 'executed'))
  const pendingTrades = computed(() => trades.value.filter((t) => t.status === 'pending'))

  const stats = computed<ITradeStats>(() => {
    const executed = executedTrades.value

    return {
      totalTrades: executed.length,
      totalBuys: executed.filter((t) => t.side === 'buy').length,
      totalSells: executed.filter((t) => t.side === 'sell').length,
      totalVolume: executed.reduce((sum, t) => sum + t.totalAmount, 0),
      totalCommission: executed.reduce((sum, t) => sum + t.commission, 0),
      averageTradeSize: executed.length
        ? executed.reduce((sum, t) => sum + t.totalAmount, 0) / executed.length
        : 0
    }
  })

  async function fetchTrades(filters?: ITradeFilters) {
    loading.value = true
    error.value = null
    try {
      trades.value = await tradesService.fetchTrades(filters)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch trades'
      console.error('Error fetching trades:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTradesByAccount(accountId: number) {
    loading.value = true
    error.value = null
    try {
      trades.value = await tradesService.fetchTradesByAccount(accountId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch trades'
      console.error('Error fetching trades:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTrade(request: ICreateTradeRequest) {
    loading.value = true
    error.value = null
    try {
      const trade = await tradesService.createTrade(request)
      trades.value.unshift(trade)
      return trade
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create trade'
      console.error('Error creating trade:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelTrade(id: number) {
    loading.value = true
    error.value = null
    try {
      const trade = await tradesService.cancelTrade(id)
      const index = trades.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        trades.value[index] = trade
      }
      return trade
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel trade'
      console.error('Error cancelling trade:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearTrades() {
    trades.value = []
    selectedTrade.value = null
  }

  return {
    // State
    trades,
    selectedTrade,
    loading,
    error,

    // Computed
    buyTrades,
    sellTrades,
    executedTrades,
    pendingTrades,
    stats,

    // Methods
    fetchTrades,
    fetchTradesByAccount,
    createTrade,
    cancelTrade,
    clearTrades
  }
}
