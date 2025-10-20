import { useAuthStore } from '@/features/auth/useAuthStore'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import './RouteMeta'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      label: 'Accueil',
      icon: 'home',
      order: 1,
    },
  },
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
    path: '/profil',
    name: 'profil',
    component: () => import('@/features/auth/ProfilView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/pages/Catalogue.vue'),
    meta: {
      requiresAuth: true,
      label: 'Catalogue',
      icon: 'folder-open',
      order: 2,
    },
  },
  {
    path: '/catalogue/:id',
    name: 'product-detail',
    component: () => import('@/pages/ProductView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/panier',
    name: 'cart',
    component: () => import('@/pages/PanierView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/paiement',
    name: 'checkout',
    component: () => import('@/pages/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/features/admin/OrdersAdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/orders/:id',
    name: 'admin-order-detail',
    component: () => import('@/features/admin/OrderDetailView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/profil/commandes',
    name: 'user-orders',
    component: () => import('@/features/user/UserOrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profil/commandes/:id',
    name: 'user-order-detail',
    component: () => import('@/features/user/UserOrderDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/confirmation/:id',
    name: 'confirmation',
    component: () => import('@/features/shop/ConfirmationView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/features/admin/UsersAdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // ✅ Initialise la session si pas déjà fait
  if (!auth.user) await auth.initAuth()

  // 🔹 Empêche un utilisateur connecté d’aller sur /login ou /register
  if (auth.isAuthenticated && ['/login', '/register'].includes(to.path)) {
    return { name: 'home' }
  }

  // 🔹 Vérifie l’accès aux routes protégées
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  // 🔹 Vérifie les routes admin si besoin
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'access-denied' }
  }

  return true
})

export default router
