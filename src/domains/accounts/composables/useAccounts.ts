import { ref, computed } from 'vue'
import { container, TOKENS } from '@/shared/config/container'
import type { AccountsService } from '../AccountsService'
import type { IAccount, IUser, ILoginRequest } from '../types'

const accountsService = container.get<AccountsService>(TOKENS.AccountsService)

export function useAccounts() {
  const accounts = ref<IAccount[]>([])
  const currentAccount = ref<IAccount | null>(null)
  const currentUser = ref<IUser | null>(accountsService.getCurrentUser())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => accountsService.isAuthenticated())

  const activeAccounts = computed(() =>
    accounts.value.filter((account) => account.status === 'active')
  )

  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.balance, 0)
  })

  const totalAvailableBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.availableBalance, 0)
  })

  async function login(credentials: ILoginRequest) {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await accountsService.login(credentials)
      window.location.href = '/'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      console.error('Login error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    accountsService.logout()
    currentUser.value = null
    accounts.value = []
    currentAccount.value = null
  }

  async function fetchAccounts() {
    loading.value = true
    error.value = null
    try {
      accounts.value = await accountsService.fetchAccounts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch accounts'
      console.error('Error fetching accounts:', err)
    } finally {
      loading.value = false
    }
  }

  async function selectAccount(id: number) {
    loading.value = true
    error.value = null
    try {
      currentAccount.value = await accountsService.fetchAccountById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch account'
      console.error('Error fetching account:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await accountsService.fetchCurrentUser()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
      console.error('Error fetching user:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    accounts,
    currentAccount,
    currentUser,
    loading,
    error,

    // Computed
    isAuthenticated,
    activeAccounts,
    totalBalance,
    totalAvailableBalance,

    // Methods
    login,
    logout,
    fetchAccounts,
    selectAccount,
    fetchCurrentUser
  }
}
