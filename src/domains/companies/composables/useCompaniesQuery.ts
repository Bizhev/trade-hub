import { computed } from 'vue'
import type { Ref } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { container, TOKENS } from '@/shared/config/container'
import type { CompaniesService } from '../CompaniesService'

const companiesService = container.get<CompaniesService>(TOKENS.CompaniesService)

/**
 * TanStack Query composable for companies list.
 *
 * Replaces manual ref<loading>/ref<error> boilerplate with automatic caching
 * and revalidation. When searchQuery changes, a new cache entry is created and
 * the previous result stays cached — so going back to an empty search is instant.
 *
 * staleTime is inherited from the global QueryClient default (5 min).
 */
export function useCompaniesQuery(searchQuery?: Ref<string>) {
  const queryClient = useQueryClient()

  const queryKey = computed(() =>
    searchQuery?.value?.trim()
      ? (['companies', 'search', searchQuery.value] as const)
      : (['companies'] as const)
  )

  const { data: companies, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () =>
      searchQuery?.value?.trim()
        ? companiesService.searchCompanies(searchQuery.value)
        : companiesService.fetchCompanies(),
  })

  /** Force-refresh the companies list (e.g. after a trade is executed). */
  function invalidateCompanies() {
    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  return { companies, isLoading, isError, error, invalidateCompanies }
}
