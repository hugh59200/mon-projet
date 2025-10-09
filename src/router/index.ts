import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AccessDeniedView from '@/features/interface/shared/access-denied/AccessDeniedView.vue'
import { registerPopupAutoGuard } from '@/features/application/popup-auto/registerPopupAutoGuard'
import { registerNavigationEvents } from './registerNavigationEvents'
import Home from '@/pages/Home.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      label: 'Accueil',
      icon: 'home',
      order: 1,
      visibility: 'visible',
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView,
    meta: {
      requiresAuth: true,
    },
  },
]

// Attention, route par défaut, toujours positionnée en dernier
const NOT_FOUND = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  redirect: { name: 'home' },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, NOT_FOUND],
})

registerPopupAutoGuard(router)
registerNavigationEvents(router)

export default router
