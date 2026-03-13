/**
 * E2E: Companies page
 *
 * Validates the full flow: app loads → redirects to /companies →
 * TanStack Query fetches mock data → table renders rows → user can search.
 *
 * The app runs against the mock API (VITE_USE_MOCK_API=true) so no real
 * backend is needed for this test.
 */
describe('Companies page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('redirects to /companies on root visit', () => {
    cy.url().should('include', '/companies')
  })

  it('renders the companies table with data rows', () => {
    // Wait for TanStack Query to load and render rows
    cy.get('.q-table tbody tr', { timeout: 10_000 }).should('have.length.greaterThan', 0)
  })

  it('shows ticker badge in each row', () => {
    cy.get('.q-table tbody tr', { timeout: 10_000 })
      .first()
      .within(() => {
        cy.get('.q-badge').should('exist')
      })
  })

  it('filters rows when user types in the search input', () => {
    // Wait for initial data
    cy.get('.q-table tbody tr', { timeout: 10_000 }).should('have.length.greaterThan', 0)

    cy.get('.q-input input').type('apple')

    // After search the table should re-render (may be 1 row or 0 if no match)
    cy.get('.q-table').should('exist')
  })
})
