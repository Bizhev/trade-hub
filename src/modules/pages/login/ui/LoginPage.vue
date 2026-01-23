<template>
  <q-page class="flex flex-center" style="background: linear-gradient(135deg, #546e7a 0%, #78909c 100%);">
    <q-card class="login-card" style="width: 400px;">
      <q-card-section>
        <div class="text-h5 text-center text-grey-8 q-mb-md">
          Company Info for Investors
        </div>
        <div class="text-subtitle2 text-center text-grey-6 q-mb-lg">
          Sign in to your account
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">
          <q-input
            v-model="username"
            outlined
            label="Username"
            type="text"
            :rules="[val => !!val || 'Username is required']"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="blue-grey-5" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            outlined
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[val => !!val || 'Password is required']"
            class="q-mb-lg"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="blue-grey-5" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="blue-grey-5"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Sign In"
            color="primary"
            class="full-width"
            size="md"
            :loading="loading"
            unelevated
          />
        </q-form>
      </q-card-section>

      <q-card-section v-if="error" class="q-pt-none">
        <q-banner dense class="text-white bg-negative">
          {{ error }}
        </q-banner>
      </q-card-section>

      <q-card-section class="text-center text-grey-6 text-caption">
        Demo credentials: any username/password
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccounts } from '@/domains/accounts/composables/useAccounts'

const { login, loading, error } = useAccounts()

const username = ref('')
const password = ref('')
const isPwd = ref(true)

async function onSubmit() {
  await login({
    username: username.value,
    password: password.value
  })
}
</script>

<style scoped>
.login-card {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}
</style>
