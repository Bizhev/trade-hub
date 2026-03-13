import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

/**
 * Mock the Inversify container so the module-level container.get() call in
 * useAccountsQuery resolves to a controllable stub instead of the real IoC container.
 */
const mockAccountsService = vi.hoisted(() => ({
  fetchAccounts: vi.fn(),
  isAuthenticated: vi.fn()
}))

vi.mock('@/shared/config/container', () => ({
  container: { get: () => mockAccountsService },
  TOKENS: { AccountsService: Symbol.for('AccountsService') }
}))

import { useAccountsQuery } from '../composables/useAccountsQuery'

function mountQuery() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  let result!: ReturnType<typeof useAccountsQuery>

  const TestComponent = defineComponent({
    setup() {
      result = useAccountsQuery()
      return {}
    },
    template: '<div />'
  })

  const wrapper = mount(TestComponent, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] }
  })

  return { result, wrapper, queryClient }
}

describe('useAccountsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does NOT fetch when user is not authenticated', async () => {
    mockAccountsService.isAuthenticated.mockReturnValue(false)
    mockAccountsService.fetchAccounts.mockResolvedValue([])

    mountQuery()

    // Wait a tick — if enabled=false, fetchAccounts should never be called
    await new Promise((r) => setTimeout(r, 50))
    expect(mockAccountsService.fetchAccounts).not.toHaveBeenCalled()
  })

  it('fetches accounts when user is authenticated', async () => {
    const accounts = [{ id: 10, accountNumber: 'ACC-001', balance: 10000 }]
    mockAccountsService.isAuthenticated.mockReturnValue(true)
    mockAccountsService.fetchAccounts.mockResolvedValue(accounts)

    mountQuery()

    await vi.waitFor(() => expect(mockAccountsService.fetchAccounts).toHaveBeenCalledTimes(1))
  })

  it('exposes isAuthenticated computed from service', () => {
    mockAccountsService.isAuthenticated.mockReturnValue(true)
    mockAccountsService.fetchAccounts.mockResolvedValue([])

    const { result } = mountQuery()

    expect(result.isAuthenticated.value).toBe(true)
  })

  it('exposes invalidateAccounts without throwing', () => {
    mockAccountsService.isAuthenticated.mockReturnValue(false)

    const { result } = mountQuery()

    expect(() => result.invalidateAccounts()).not.toThrow()
  })
})
