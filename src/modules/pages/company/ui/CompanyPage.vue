<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h4 q-my-md">Companies</h4>

      <q-input
        v-model="searchQuery"
        outlined
        dense
        placeholder="Search companies by name or ticker..."
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table
      :rows="companies ?? []"
      :columns="columns"
      :loading="isLoading"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 20 }"
    >
      <template v-slot:body-cell-ticker="props">
        <q-td :props="props">
          <q-badge color="blue-grey-6">{{ props.value }}</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-sector="props">
        <q-td :props="props">
          <q-badge color="grey-7" outline>{{ props.value }}</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-marketCap="props">
        <q-td :props="props">
          {{ formatCurrency(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-revenue="props">
        <q-td :props="props">
          {{ formatCurrency(props.row.financials.revenue) }}
        </q-td>
      </template>

      <template v-slot:body-cell-pe="props">
        <q-td :props="props">
          {{ props.row.financials.pe.toFixed(2) }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { useCompaniesQuery } from '@/domains/companies/composables/useCompaniesQuery'

const searchQuery = ref('')
const { companies, isLoading } = useCompaniesQuery(searchQuery)

const columns: QTableColumn[] = [
  {
    name: 'ticker',
    label: 'Ticker',
    field: 'ticker',
    align: 'left',
    sortable: true
  },
  {
    name: 'name',
    label: 'Company Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'sector',
    label: 'Sector',
    field: 'sector',
    align: 'left',
    sortable: true
  },
  {
    name: 'marketCap',
    label: 'Market Cap',
    field: 'marketCap',
    align: 'right',
    sortable: true
  },
  {
    name: 'revenue',
    label: 'Revenue',
    field: (row: any) => row.financials.revenue,
    align: 'right',
    sortable: true
  },
  {
    name: 'pe',
    label: 'P/E Ratio',
    field: (row: any) => row.financials.pe,
    align: 'right',
    sortable: true
  },
  {
    name: 'employees',
    label: 'Employees',
    field: 'employees',
    align: 'right',
    sortable: true,
    format: (val: number) => val.toLocaleString()
  }
]

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  } else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  return `$${value.toLocaleString()}`
}

// No manual fetch needed — useCompaniesQuery reacts to searchQuery changes automatically.
</script>
