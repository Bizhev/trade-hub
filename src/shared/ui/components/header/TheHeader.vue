<template>
  <q-header elevated class="bg-blue-grey-7 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <router-link to="/" class="text-white text-decoration-none">
          Company Info for Investors
        </router-link>
      </q-toolbar-title>

      <q-btn-group flat>
        <q-btn
          flat
          label="Companies"
          to="/companies"
          :class="{ 'text-weight-bold': isActive('/companies') }"
        />
        <q-btn
          flat
          label="Accounts"
          to="/accounts"
          :class="{ 'text-weight-bold': isActive('/accounts') }"
        />
      </q-btn-group>

      <q-space />

      <q-btn
        flat
        round
        dense
        icon="account_circle"
        @click="onUserClick"
      >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const isActive = (path: string) => {
  return computed(() => route.path === path).value
}

function onUserClick() {
  // User menu clicked
}

function onLogout() {
  // Clear auth and redirect to login
  localStorage.removeItem('bear')
  router.push('/login')
}
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
