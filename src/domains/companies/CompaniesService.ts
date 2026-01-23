import { api } from '@/shared/api'
import type { ICompany, ICompanyFilters } from './types'

/**
 * Companies Domain Service
 * Manages company data
 */
export class CompaniesService {
  private static instance: CompaniesService

  private constructor() {}

  static getInstance(): CompaniesService {
    if (!CompaniesService.instance) {
      CompaniesService.instance = new CompaniesService()
    }
    return CompaniesService.instance
  }

  /**
   * Get list of companies
   */
  async fetchCompanies(filters?: ICompanyFilters): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies', {
      params: filters
    })
    return data
  }

  /**
   * Get company by ID
   */
  async fetchCompanyById(id: number): Promise<ICompany> {
    const { data } = await api.get<ICompany>(`/api/companies/${id}`)
    return data
  }

  /**
   * Get company by ticker
   */
  async fetchCompanyByTicker(ticker: string): Promise<ICompany> {
    const { data } = await api.get<ICompany>(`/api/companies/ticker/${ticker}`)
    return data
  }

  /**
   * Search companies
   */
  async searchCompanies(query: string): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies/search', {
      params: { q: query }
    })
    return data
  }

  /**
   * Get companies by sector
   */
  async fetchCompaniesBySector(sector: string): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies', {
      params: { sector }
    })
    return data
  }
}

export const companiesService = CompaniesService.getInstance()
