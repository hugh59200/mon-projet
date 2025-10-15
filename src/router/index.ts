import AccessDeniedView from '@/features/interface/shared/access-denied/AccessDeniedView.vue'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView,
  },
]

const NOT_FOUND = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  redirect: { name: 'home' },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, NOT_FOUND],
})

export default router
