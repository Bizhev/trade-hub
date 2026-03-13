import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'reflect-metadata'

vi.mock('@/shared/api', () => ({
  api: {
    get: vi.fn()
  }
}))

import { api } from '@/shared/api'
import { CompaniesService } from '../CompaniesService'

const mockGet = vi.mocked(api.get)

const stubCompany = {
  id: 1, ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology',
  marketCap: 3_000_000_000_000, employees: 161_000, founded: 1976,
  financials: { revenue: 400_000_000_000, pe: 28 }
}

describe('CompaniesService', () => {
  let service: CompaniesService

  beforeEach(() => {
    service = new CompaniesService()
    vi.clearAllMocks()
  })

  describe('fetchCompanies', () => {
    it('returns array from API', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubCompany] } as never)

      const result = await service.fetchCompanies()

      expect(mockGet).toHaveBeenCalledWith('/api/companies', { params: undefined })
      expect(result).toEqual([stubCompany])
    })

    it('passes filters as query params', async () => {
      mockGet.mockResolvedValueOnce({ data: [] } as never)

      await service.fetchCompanies({ sector: 'Technology' })

      expect(mockGet).toHaveBeenCalledWith('/api/companies', { params: { sector: 'Technology' } })
    })
  })

  describe('fetchCompanyById', () => {
    it('fetches company by id', async () => {
      mockGet.mockResolvedValueOnce({ data: stubCompany } as never)

      const result = await service.fetchCompanyById(1)

      expect(mockGet).toHaveBeenCalledWith('/api/companies/1')
      expect(result).toEqual(stubCompany)
    })
  })

  describe('fetchCompanyByTicker', () => {
    it('fetches company by ticker', async () => {
      mockGet.mockResolvedValueOnce({ data: stubCompany } as never)

      const result = await service.fetchCompanyByTicker('AAPL')

      expect(mockGet).toHaveBeenCalledWith('/api/companies/ticker/AAPL')
      expect(result).toEqual(stubCompany)
    })
  })

  describe('searchCompanies', () => {
    it('passes search query as q param', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubCompany] } as never)

      const result = await service.searchCompanies('apple')

      expect(mockGet).toHaveBeenCalledWith('/api/companies/search', { params: { q: 'apple' } })
      expect(result).toEqual([stubCompany])
    })
  })

  describe('fetchCompaniesBySector', () => {
    it('passes sector as query param', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubCompany] } as never)

      await service.fetchCompaniesBySector('Technology')

      expect(mockGet).toHaveBeenCalledWith('/api/companies', { params: { sector: 'Technology' } })
    })
  })
})
