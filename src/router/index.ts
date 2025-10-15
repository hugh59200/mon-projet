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
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/features/auth/ResetPasswordView.vue'),
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

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // attends l'initialisation de la session (utile au premier chargement)
  if (!auth.user) {
    await auth.initAuth()
  }

  // redirige vers /login si la route requiert l'authentification
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  // si déjà connecté et tente d'aller sur /login ou /register, redirige vers /
  if (auth.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
    return { name: 'home' }
  }

  return true
})

export default router
