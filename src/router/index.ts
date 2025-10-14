import { useAuthStore } from '@/auth/auth'
import { registerPopupAutoGuard } from '@/features/application/popup-auto/registerPopupAutoGuard'
import AccessDeniedView from '@/features/interface/shared/access-denied/AccessDeniedView.vue'
import Home from '@/pages/Home.vue'
import type { Router } from 'vue-router' // 👈 ajoute cette ligne en haut
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { registerNavigationEvents } from './registerNavigationEvents'

function registerAuthGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const auth = useAuthStore()

    // 🔁 Restaure la session si elle existe
    if (!auth.user && localStorage.getItem('auth_user')) {
      auth.restore()
    }

    // 🔒 Si la route exige une auth et que l’utilisateur n’est pas connecté
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      next({ name: 'access-denied' })
    } else {
      next()
    }
  })
}

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
      requiresAuth: true, // 👈 Protégée par login
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView,
    meta: {
      requiresAuth: false,
    },
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

registerPopupAutoGuard(router)
registerNavigationEvents(router)
registerAuthGuard(router) // ✅ Ajout du guard

export default router
