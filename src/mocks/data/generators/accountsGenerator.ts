import { faker } from '@faker-js/faker'
import type { IAccount, IUser, AccountType, AccountStatus } from '@/domains/accounts/types'
import dayjs from 'dayjs'

const ACCOUNT_TYPES: AccountType[] = ['brokerage', 'retirement', 'margin', 'cash']
const ACCOUNT_STATUSES: AccountStatus[] = ['active', 'inactive']
const CURRENCIES = ['USD', 'RUB', 'EUR']

export function generateUser(id: number): IUser {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id,
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    firstName,
    lastName,
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    createdAt: dayjs().subtract(faker.number.int({ min: 365, max: 1825 }), 'day').toISOString()
  }
}

export function generateAccount(
  id: number,
  userId: number,
  accountType?: AccountType,
  status?: AccountStatus
): IAccount {
  const balance = faker.number.float({ min: 1000, max: 1000000, fractionDigits: 2 })
  const reservedFunds = faker.number.float({ min: 0, max: balance * 0.2, fractionDigits: 2 })

  return {
    id,
    userId,
    accountNumber: faker.finance.accountNumber(10),
    accountType: accountType || faker.helpers.arrayElement(ACCOUNT_TYPES),
    currency: faker.helpers.arrayElement(CURRENCIES),
    balance,
    availableBalance: balance - reservedFunds,
    status: status || faker.helpers.arrayElement(ACCOUNT_STATUSES),
    createdAt: dayjs().subtract(faker.number.int({ min: 30, max: 730 }), 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  }
}

export function generateAccounts(
  count: number = 3,
  userId: number = 1
): IAccount[] {
  const accounts: IAccount[] = []

  // Первый аккаунт всегда активный brokerage
  accounts.push(generateAccount(1, userId, 'brokerage', 'active'))

  // Остальные аккаунты
  for (let i = 2; i <= count; i++) {
    accounts.push(generateAccount(i, userId))
  }

  return accounts
}
