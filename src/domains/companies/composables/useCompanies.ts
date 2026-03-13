import { ref, computed } from 'vue'
import { container, TOKENS } from '@/shared/config/container'
import type { CompaniesService } from '../CompaniesService'
import type { ICompany, ICompanyFilters } from '../types'

const companiesService = container.get<CompaniesService>(TOKENS.CompaniesService)

export function useCompanies() {
  const companies = ref<ICompany[]>([])
  const selectedCompany = ref<ICompany | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalMarketCap = computed(() => {
    return companies.value.reduce((sum, company) => sum + company.marketCap, 0)
  })

  const companiesBySector = computed(() => {
    const grouped = new Map<string, ICompany[]>()
    companies.value.forEach((company) => {
      const sector = company.sector
      if (!grouped.has(sector)) {
        grouped.set(sector, [])
      }
      grouped.get(sector)!.push(company)
    })
    return grouped
  })

  async function fetchCompanies(filters?: ICompanyFilters) {
    loading.value = true
    error.value = null
    try {
      companies.value = await companiesService.fetchCompanies(filters)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch companies'
      console.error('Error fetching companies:', err)
    } finally {
      loading.value = false
    }
  }

  async function selectCompany(id: number) {
    loading.value = true
    error.value = null
    try {
      selectedCompany.value = await companiesService.fetchCompanyById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch company'
      console.error('Error fetching company:', err)
    } finally {
      loading.value = false
    }
  }

  async function selectCompanyByTicker(ticker: string) {
    loading.value = true
    error.value = null
    try {
      selectedCompany.value = await companiesService.fetchCompanyByTicker(ticker)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch company'
      console.error('Error fetching company by ticker:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchCompanies(query: string) {
    if (!query.trim()) {
      return
    }
    loading.value = true
    error.value = null
    try {
      companies.value = await companiesService.searchCompanies(query)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search companies'
      console.error('Error searching companies:', err)
    } finally {
      loading.value = false
    }
  }

  function clearSelection() {
    selectedCompany.value = null
  }

  return {
    // State
    companies,
    selectedCompany,
    loading,
    error,

    // Computed
    totalMarketCap,
    companiesBySector,

    // Methods
    fetchCompanies,
    selectCompany,
    selectCompanyByTicker,
    searchCompanies,
    clearSelection
  }
}
