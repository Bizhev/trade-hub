// Accounts domain types

export interface IAccount {
  id: number
  userId: number
  accountNumber: string
  accountType: AccountType
  currency: string
  balance: number
  availableBalance: number
  status: AccountStatus
  createdAt: string
  updatedAt: string
}

export type AccountType = 'brokerage' | 'retirement' | 'margin' | 'cash'

export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'closed'

export interface IUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  createdAt: string
}

export interface ILoginRequest {
  username: string
  password: string
}

export interface ILoginResponse {
  access_token: string
  user: IUser
  expiresIn: number
}

export interface IAccountSummary {
  totalBalance: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
  accountsCount: number
}
