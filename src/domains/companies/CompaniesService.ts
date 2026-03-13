import { injectable } from 'inversify'
import { api } from '@/shared/api'
import type { ICompany, ICompanyFilters } from './types'

@injectable()
export class CompaniesService {
  async fetchCompanies(filters?: ICompanyFilters): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies', { params: filters })
    return data
  }

  async fetchCompanyById(id: number): Promise<ICompany> {
    const { data } = await api.get<ICompany>(`/api/companies/${id}`)
    return data
  }

  async fetchCompanyByTicker(ticker: string): Promise<ICompany> {
    const { data } = await api.get<ICompany>(`/api/companies/ticker/${ticker}`)
    return data
  }

  async searchCompanies(query: string): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies/search', { params: { q: query } })
    return data
  }

  async fetchCompaniesBySector(sector: string): Promise<ICompany[]> {
    const { data } = await api.get<ICompany[]>('/api/companies', { params: { sector } })
    return data
  }
}
