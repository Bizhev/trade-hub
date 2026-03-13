<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h4 q-my-md">Accounts</h4>
    </div>

    <q-table
      :rows="accounts ?? []"
      :columns="columns"
      :loading="isLoading"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-accountType="props">
        <q-td :props="props">
          <q-badge :color="getTypeColor(props.value)">{{ props.value }}</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.value === 'active' ? 'positive' : 'grey'">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-balance="props">
        <q-td :props="props">
          {{ formatCurrency(props.value, props.row.currency) }}
        </q-td>
      </template>

      <template v-slot:body-cell-availableBalance="props">
        <q-td :props="props">
          {{ formatCurrency(props.value, props.row.currency) }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import { useAccountsQuery } from '@/domains/accounts/composables/useAccountsQuery'

const { accounts, isLoading } = useAccountsQuery()

const columns: QTableColumn[] = [
  {
    name: 'accountNumber',
    label: 'Account Number',
    field: 'accountNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'accountType',
    label: 'Type',
    field: 'accountType',
    align: 'left',
    sortable: true
  },
  {
    name: 'currency',
    label: 'Currency',
    field: 'currency',
    align: 'center',
    sortable: true
  },
  {
    name: 'balance',
    label: 'Balance',
    field: 'balance',
    align: 'right',
    sortable: true
  },
  {
    name: 'availableBalance',
    label: 'Available Balance',
    field: 'availableBalance',
    align: 'right',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true
  }
]

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    brokerage: 'blue-grey',
    retirement: 'deep-orange',
    margin: 'amber',
    cash: 'teal'
  }
  return colors[type] || 'grey'
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(value)
}

// No manual fetch needed — useAccountsQuery fetches automatically when authenticated.
</script>
