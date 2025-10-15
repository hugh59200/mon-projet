import { useAuthStore } from '@/features/auth/useAuthStore'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: () => import('@/features/auth/LoginView.vue') },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/features/auth/RegisterView.vue'),
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/features/auth/AccessDeniedView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔒 Middleware global
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user) await auth.initAuth()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'access-denied' }
  }

  return true
})

export default router
