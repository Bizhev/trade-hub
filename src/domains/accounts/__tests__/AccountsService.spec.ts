import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'reflect-metadata'

/**
 * Mock the api module before importing AccountsService so that the
 * constructor's localStorage.getItem / api.defaults.headers side-effect
 * works against our stub object rather than a real axios instance.
 */
vi.mock('@/shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: { headers: { common: {} } }
  }
}))

import { api } from '@/shared/api'
import { AccountsService } from '../AccountsService'

const mockGet = vi.mocked(api.get)
const mockPost = vi.mocked(api.post)

const stubUser = {
  id: 1, username: 'john', email: 'john@test.com',
  firstName: 'John', lastName: 'Doe', createdAt: '2024-01-01'
}

const stubAccount = {
  id: 10, userId: 1, accountNumber: 'ACC-001', accountType: 'brokerage',
  currency: 'USD', balance: 10_000, availableBalance: 9_500,
  status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01'
}

describe('AccountsService', () => {
  let service: AccountsService

  beforeEach(() => {
    // Clear localStorage before each test so constructor has a clean state
    localStorage.clear()
    service = new AccountsService()
    vi.clearAllMocks()
  })

  describe('isAuthenticated', () => {
    it('returns false when no token in localStorage', () => {
      expect(service.isAuthenticated()).toBe(false)
    })

    it('returns true after token is set via login', async () => {
      mockPost.mockResolvedValueOnce({
        data: { access_token: 'tok_abc', user: stubUser, expiresIn: 3600 }
      } as never)

      await service.login({ username: 'john', password: 'pass' })

      expect(service.isAuthenticated()).toBe(true)
    })
  })

  describe('login', () => {
    it('returns user and stores token on success', async () => {
      mockPost.mockResolvedValueOnce({
        data: { access_token: 'tok_abc', user: stubUser, expiresIn: 3600 }
      } as never)

      const user = await service.login({ username: 'john', password: 'pass' })

      expect(user).toEqual(stubUser)
      expect(localStorage.getItem('bear')).toContain('tok_abc')
    })

    it('throws when API returns no access_token', async () => {
      mockPost.mockResolvedValueOnce({ data: {} } as never)

      await expect(service.login({ username: 'john', password: 'pass' })).rejects.toThrow(
        'No access token in response'
      )
    })
  })

  describe('getCurrentUser', () => {
    it('returns null before login', () => {
      expect(service.getCurrentUser()).toBeNull()
    })

    it('returns user after login', async () => {
      mockPost.mockResolvedValueOnce({
        data: { access_token: 'tok', user: stubUser, expiresIn: 3600 }
      } as never)

      await service.login({ username: 'john', password: 'pass' })

      expect(service.getCurrentUser()).toEqual(stubUser)
    })
  })

  describe('fetchAccounts', () => {
    it('calls /api/user/accounts and returns data', async () => {
      mockGet.mockResolvedValueOnce({ data: [stubAccount] } as never)

      const result = await service.fetchAccounts()

      expect(mockGet).toHaveBeenCalledWith('/api/user/accounts')
      expect(result).toEqual([stubAccount])
    })
  })

  describe('fetchAccountById', () => {
    it('fetches by id', async () => {
      mockGet.mockResolvedValueOnce({ data: stubAccount } as never)

      const result = await service.fetchAccountById(10)

      expect(mockGet).toHaveBeenCalledWith('/api/user/accounts/10')
      expect(result).toEqual(stubAccount)
    })
  })

  describe('fetchCurrentUser', () => {
    it('calls /api/user/me and updates currentUser', async () => {
      mockGet.mockResolvedValueOnce({ data: stubUser } as never)

      const result = await service.fetchCurrentUser()

      expect(mockGet).toHaveBeenCalledWith('/api/user/me')
      expect(result).toEqual(stubUser)
      expect(service.getCurrentUser()).toEqual(stubUser)
    })
  })
})
