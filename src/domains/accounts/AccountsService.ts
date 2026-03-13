import { injectable } from 'inversify'
import { api } from '@/shared/api'
import type { IAccount, IUser, ILoginRequest, ILoginResponse } from './types'

@injectable()
export class AccountsService {
  private currentUser: IUser | null = null
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('bear')
    if (this.token) {
      api.defaults.headers.common.Authorization = this.token
    }
  }

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

  logout(): void {
    this.clearToken()
    this.currentUser = null
    window.location.href = '/login'
  }

  getCurrentUser(): IUser | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }

  async fetchAccounts(): Promise<IAccount[]> {
    const { data } = await api.get<IAccount[]>('/api/user/accounts')
    return data
  }

  async fetchAccountById(id: number): Promise<IAccount> {
    const { data } = await api.get<IAccount>(`/api/user/accounts/${id}`)
    return data
  }

  async fetchCurrentUser(): Promise<IUser> {
    const { data } = await api.get<IUser>('/api/user/me')
    this.currentUser = data
    return data
  }

  private setToken(token: string): void {
    this.token = token
    const bearerToken = `Bearer ${token}`
    localStorage.setItem('bear', bearerToken)
    api.defaults.headers.common.Authorization = bearerToken
  }

  private clearToken(): void {
    this.token = null
    localStorage.removeItem('bear')
    delete api.defaults.headers.common.Authorization
  }
}
