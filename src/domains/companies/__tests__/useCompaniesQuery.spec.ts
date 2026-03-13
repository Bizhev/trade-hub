import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, type Ref } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

/**
 * Mock the Inversify container so that the module-level container.get() call
 * inside useCompaniesQuery.ts resolves to our stub service instead of the
 * real IoC container (which would require all @injectable() services to be
 * registered and reflect-metadata to be bootstrapped).
 */
const mockService = vi.hoisted(() => ({
  fetchCompanies: vi.fn(),
  searchCompanies: vi.fn()
}))

vi.mock('@/shared/config/container', () => ({
  container: { get: () => mockService },
  TOKENS: { CompaniesService: Symbol.for('CompaniesService') }
}))

import { useCompaniesQuery } from '../composables/useCompaniesQuery'

// ----- helpers -----

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

/**
 * Mounts a headless component that calls the composable.
 * Returns the reactive result and the QueryClient for direct assertions.
 */
function mountQuery(searchQuery?: Ref<string>) {
  const queryClient = makeQueryClient()
  let result!: ReturnType<typeof useCompaniesQuery>

  const TestComponent = defineComponent({
    setup() {
      result = useCompaniesQuery(searchQuery)
      return {}
    },
    template: '<div />'
  })

  const wrapper = mount(TestComponent, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] }
  })

  return { result, wrapper, queryClient }
}

// ----- tests -----

describe('useCompaniesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchCompanies when searchQuery is empty', async () => {
    const companies = [{ id: 1, name: 'Apple', ticker: 'AAPL' }]
    mockService.fetchCompanies.mockResolvedValueOnce(companies)

    const searchQuery = ref('')
    mountQuery(searchQuery)

    // Give the query a tick to execute
    await vi.waitFor(() => expect(mockService.fetchCompanies).toHaveBeenCalledTimes(1))
    expect(mockService.searchCompanies).not.toHaveBeenCalled()
  })

  it('calls searchCompanies when searchQuery has value', async () => {
    mockService.searchCompanies.mockResolvedValueOnce([])

    const searchQuery = ref('tesla')
    mountQuery(searchQuery)

    await vi.waitFor(() => expect(mockService.searchCompanies).toHaveBeenCalledWith('tesla'))
    expect(mockService.fetchCompanies).not.toHaveBeenCalled()
  })

  it('fetchCompanies when mounted without searchQuery arg', async () => {
    mockService.fetchCompanies.mockResolvedValueOnce([])

    mountQuery() // no searchQuery passed

    await vi.waitFor(() => expect(mockService.fetchCompanies).toHaveBeenCalledTimes(1))
  })

  it('exposes invalidateCompanies without throwing', () => {
    mockService.fetchCompanies.mockResolvedValue([])

    const { result } = mountQuery()

    expect(() => result.invalidateCompanies()).not.toThrow()
  })
})
