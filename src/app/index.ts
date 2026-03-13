import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

import { Quasar } from './providers/quasar'
import 'reflect-metadata'

import App from './App.vue'
import router from './providers/router'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 min default — avoid redundant refetches
            retry: 1,
        },
    },
})

export const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueQueryPlugin, { queryClient })
    .use(Quasar, {
        plugins: {}, // import Quasar plugins and add here
    })
