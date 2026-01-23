import { ref, computed } from 'vue'
import { instrumentsService } from '../InstrumentsService'
import type {
  IInstrument,
  IStock,
  IETF,
  IBond,
  InstrumentType,
  IInstrumentFilters
} from '../types'

export function useInstruments() {
  const instruments = ref<IInstrument[]>([])
  const selectedInstrument = ref<IInstrument | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const stocks = computed(() =>
    instruments.value.filter((i) => i.type === 'stock') as IStock[]
  )

  const etfs = computed(() =>
    instruments.value.filter((i) => i.type === 'etf') as IETF[]
  )

  const bonds = computed(() =>
    instruments.value.filter((i) => i.type === 'bond') as IBond[]
  )

  const instrumentsByExchange = computed(() => {
    const grouped = new Map<string, IInstrument[]>()
    instruments.value.forEach((instrument) => {
      const exchange = instrument.exchange
      if (!grouped.has(exchange)) {
        grouped.set(exchange, [])
      }
      grouped.get(exchange)!.push(instrument)
    })
    return grouped
  })

  async function fetchInstruments(filters?: IInstrumentFilters) {
    loading.value = true
    error.value = null
    try {
      instruments.value = await instrumentsService.fetchInstruments(filters)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch instruments'
      console.error('Error fetching instruments:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchByType(type: InstrumentType) {
    loading.value = true
    error.value = null
    try {
      switch (type) {
        case 'stock':
          instruments.value = await instrumentsService.fetchStocks()
          break
        case 'etf':
          instruments.value = await instrumentsService.fetchETFs()
          break
        case 'bond':
          instruments.value = await instrumentsService.fetchBonds()
          break
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to fetch ${type}s`
      console.error(`Error fetching ${type}s:`, err)
    } finally {
      loading.value = false
    }
  }

  async function selectInstrument(id: number) {
    loading.value = true
    error.value = null
    try {
      selectedInstrument.value = await instrumentsService.fetchInstrumentById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch instrument'
      console.error('Error fetching instrument:', err)
    } finally {
      loading.value = false
    }
  }

  async function selectInstrumentByTicker(ticker: string) {
    loading.value = true
    error.value = null
    try {
      selectedInstrument.value = await instrumentsService.fetchInstrumentByTicker(ticker)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch instrument'
      console.error('Error fetching instrument by ticker:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchInstruments(query: string, type?: InstrumentType) {
    if (!query.trim()) {
      return
    }
    loading.value = true
    error.value = null
    try {
      instruments.value = await instrumentsService.searchInstruments(query, type)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search instruments'
      console.error('Error searching instruments:', err)
    } finally {
      loading.value = false
    }
  }

  function clearSelection() {
    selectedInstrument.value = null
  }

  return {
    // State
    instruments,
    selectedInstrument,
    loading,
    error,

    // Computed
    stocks,
    etfs,
    bonds,
    instrumentsByExchange,

    // Methods
    fetchInstruments,
    fetchByType,
    selectInstrument,
    selectInstrumentByTicker,
    searchInstruments,
    clearSelection
  }
}
