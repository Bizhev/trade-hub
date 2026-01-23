import { api } from '@/shared/api'
import type { IAccount, IUser, ILoginRequest, ILoginResponse } from './types'

/**
 * Accounts Domain Service
 * Manages accounts and authentication
 */
export class AccountsService {
  private static instance: AccountsService
  private currentUser: IUser | null = null
  private token: string | null = null

  private constructor() {
    // Restore token from localStorage on initialization
    this.token = localStorage.getItem('bear')
    if (this.token) {
      api.defaults.headers.common.Authorization = this.token
    }
  }

  static getInstance(): AccountsService {
    if (!AccountsService.instance) {
      AccountsService.instance = new AccountsService()
    }
    return AccountsService.instance
  }

  /**
   * Login to system
   */
  async login(credentials: ILoginRequest): Promise<IUser> {
    try {
      const { data } = await api.post<ILoginResponse>('/api/auth/login', credentials)

      if (data.access_token) {
        this.setToken(data.access_token)
        this.currentUser = data.user
        return data.user
      }

      throw new Error('No access token in response')
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  /**
   * Logout from system
   */
  logout(): void {
    this.clearToken()
    this.currentUser = null
    window.location.href = '/login'
  }

  /**
   * Get current user
   */
  getCurrentUser(): IUser | null {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.token !== null
  }

  /**
   * Set token
   */
  private setToken(token: string): void {
    this.token = token
    const bearerToken = `Bearer ${token}`
    localStorage.setItem('bear', bearerToken)
    api.defaults.headers.common.Authorization = bearerToken
  }

  /**
   * Clear token
   */
  private clearToken(): void {
    this.token = null
    localStorage.removeItem('bear')
    delete api.defaults.headers.common.Authorization
  }

  /**
   * Get user accounts list
   */
  async fetchAccounts(): Promise<IAccount[]> {
    const { data } = await api.get<IAccount[]>('/api/user/accounts')
    return data
  }

  /**
   * Get account by ID
   */
  async fetchAccountById(id: number): Promise<IAccount> {
    const { data } = await api.get<IAccount>(`/api/user/accounts/${id}`)
    return data
  }

  /**
   * Get current user information
   */
  async fetchCurrentUser(): Promise<IUser> {
    const { data } = await api.get<IUser>('/api/user/me')
    this.currentUser = data
    return data
  }
}

export const accountsService = AccountsService.getInstance()
