import { computed } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { container, TOKENS } from '@/shared/config/container'
import type { AccountsService } from '../AccountsService'

const accountsService = container.get<AccountsService>(TOKENS.AccountsService)

/**
 * TanStack Query composable for the current user's accounts.
 *
 * Fetching is gated on isAuthenticated — unauthenticated users receive
 * an empty result without triggering a network request.
 *
 * After login/logout the caller should call invalidateAccounts() so the
 * cache is cleared and the next render re-fetches fresh data.
 */
export function useAccountsQuery() {
  const queryClient = useQueryClient()

  const isAuthenticated = computed(() => accountsService.isAuthenticated())

  const { data: accounts, isLoading, isError, error } = useQuery({
    queryKey: ['accounts'] as const,
    queryFn: () => accountsService.fetchAccounts(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // accounts balance may change faster — 2 min
  })

  /** Invalidate cached accounts — call after deposits, trades, or logout. */
  function invalidateAccounts() {
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
  }

  return { accounts, isLoading, isError, error, isAuthenticated, invalidateAccounts }
}
