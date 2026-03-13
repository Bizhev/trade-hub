import { createRouter, createWebHashHistory } from 'vue-router'
import {FullPage, MainLayout} from "@/shared/ui/layouts";

const routes = [
  {
    path: '/companies',
    name: 'companies',
    component: () => import('@/modules/pages/company'),
    meta: {
      layout: MainLayout
    }
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@/modules/pages/accounts'),
    meta: {
      layout: MainLayout
    }
  },
  {
    path: '/',
    redirect: '/companies',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/pages/login'),
    meta: {
      layout: FullPage
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
