import AdminNewsTable from '@/features/admin/news/AdminNewsView.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsView.vue'
import AdminTopicsTable from '@/features/admin/topics/AdminTopicsView.vue'
import AdminUsersView from '@/features/admin/users/AdminUsersView.vue'
import AuthLayout from '@/features/auth/AuthLayout.vue'
import AdminChatView from '@/features/chat/admin/AdminChatView.vue'
import AdminStatsView from '@/features/stats/AdminStatsView.vue'
import Home from '@/features/home/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import './RouteMeta'
import { registerBaseGuard } from './registerBaseGuard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      labelKey: 'nav.home',
      icon: 'Home',
      order: 1,
      titleKey: 'routes.home.title',
      descriptionKey: 'routes.home.description',
    },
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/features/auth/AuthLogin.vue'),
        meta: { titleKey: 'routes.auth.login' },
      },
      {
        path: 'register',
        name: 'auth-register',
        component: () => import('@/features/auth/AuthRegister.vue'),
        meta: { titleKey: 'routes.auth.register' },
      },
      {
        path: 'reset-password',
        name: 'auth-reset',
        component: () => import('@/features/auth/AuthReset.vue'),
        meta: { titleKey: 'routes.auth.reset' },
      },
      {
        path: 'email-sent',
        name: 'email-sent',
        component: () => import('@/features/auth/AuthEmailSent.vue'),
        meta: { titleKey: 'routes.auth.emailSent' },
      },
      {
        path: 'callback',
        name: 'auth-callback',
        component: () => import('@/features/auth/AuthCallback.vue'),
        meta: { titleKey: 'routes.auth.callback' },
      },
    ],
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/features/profile/ProfilView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'routes.profile.title',
      descriptionKey: 'routes.profile.description',
    },
  },
  {
    path: '/profil/commandes',
    name: 'orders',
    component: () => import('@/features/order/OrdersView.vue'),
    meta: {
      requiresAuth: true,
      headingKey: 'orders.title',
      titleKey: 'routes.orders.title',
      descriptionKey: 'routes.orders.description',
    },
  },
  {
    path: '/profil/commandes/:id',
    name: 'order-detail',
    component: () => import('@/features/order/OrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'routes.orderDetail.title',
    },
  },
  {
    path: '/update-password',
    name: 'update-password',
    component: () => import('@/features/auth/UpdatePasswordView.vue'),
    meta: {
      titleKey: 'routes.updatePassword.title',
      descriptionKey: 'routes.updatePassword.description',
    },
  },
  {
    path: '/update-password/success',
    name: 'update-password-success',
    component: () => import('@/features/auth/UpdatePasswordSuccessView.vue'),
    meta: {
      titleKey: 'routes.updatePasswordSuccess.title',
      descriptionKey: 'routes.updatePasswordSuccess.description',
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/features/auth/AccessDeniedView.vue'),
    meta: { titleKey: 'routes.accessDenied.title' },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/features/catalogue/Catalogue.vue'),
    meta: {
      labelKey: 'nav.catalogue',
      icon: 'Boxes',
      order: 2,
      titleKey: 'routes.catalogue.title',
      headingKey: 'routes.catalogue.heading',
      descriptionKey: 'routes.catalogue.description',
    },
  },
  {
    path: '/catalogue/:id',
    name: 'product-detail',
    component: () => import('@/features/catalogue/ProductDetails.vue'),
    meta: {
      titleKey: 'routes.product.title',
    },
  },
  {
    path: '/actualites',
    name: 'actualites',
    component: () => import('@/features/actualités/ActualitesView.vue'),
    meta: {
      labelKey: 'nav.news',
      icon: 'Newspaper',
      order: 3,
      headingKey: 'routes.news.heading',
      titleKey: 'routes.news.title',
      descriptionKey: 'routes.news.description',
      badgeKey: 'routes.news.badge',
      headerIcon: 'Newspaper',
    },
  },
  {
    path: '/actualites/:slug',
    name: 'actualite-detail',
    component: () => import('@/features/actualités/ActualiteDetailView.vue'),
    meta: {
      descriptionKey: 'routes.newsDetail.description',
    },
  },
  {
    path: '/panier',
    name: 'cart',
    component: () => import('@/features/catalogue/cart/CartView.vue'),
    meta: {
      headingKey: 'cart.title',
      titleKey: 'routes.cart.title',
      descriptionKey: 'routes.cart.description',
      badgeKey: 'routes.cart.badge',
      headerIcon: 'ShoppingCart',
    },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/features/checkout/CheckoutView.vue'),
    meta: { requiresCart: true, titleKey: 'checkout.title' },
  },
  {
    path: '/paiement/success',
    name: 'payment-success',
    component: () => import('@/features/checkout/paiement/PaymentSuccessView.vue'),
    meta: { titleKey: 'routes.paymentSuccess.title', requiresAuth: false },
  },
  {
    path: '/paiement/cancel',
    name: 'payment-cancel',
    component: () => import('@/features/checkout/paiement/PaymentCancelView.vue'),
    meta: { titleKey: 'routes.paymentCancel.title' },
  },
  {
    path: '/suivi-commande',
    name: 'track-order',
    component: () => import('@/features/tracking/TrackOrderView.vue'),
    meta: {
      titleKey: 'routes.tracking.title',
      headingKey: 'routes.tracking.heading',
      descriptionKey: 'routes.tracking.description',
      badgeKey: 'routes.tracking.badge',
      headerIcon: 'Package',
      requiresAuth: false,
    },
  },
  {
    path: '/admin',
    component: () => import('@/features/admin/AdminTabsView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      headingKey: 'routes.admin.heading',
      titleKey: 'routes.admin.title',
      descriptionKey: 'routes.admin.description',
    },
    redirect: { name: 'AdminUsers' },
    children: [
      {
        path: 'utilisateurs',
        name: 'AdminUsers',
        component: AdminUsersView,
        meta: { labelKey: 'admin.users', icon: 'Users' },
      },
      {
        path: 'commandes',
        name: 'AdminOrders',
        component: AdminOrdersView,
        meta: { labelKey: 'admin.orders', icon: 'ShoppingCart' },
      },
      {
        path: 'produits',
        name: 'AdminProducts',
        component: AdminProductsTable,
        meta: { labelKey: 'admin.products', icon: 'PackageSearch' },
      },
      {
        path: 'actualites',
        name: 'AdminNews',
        component: AdminNewsTable,
        meta: { labelKey: 'admin.news', icon: 'Newspaper' },
      },
      {
        path: 'topics',
        name: 'AdminTopics',
        component: AdminTopicsTable,
        meta: { labelKey: 'admin.categories', icon: 'FolderTree' },
      },
      {
        path: 'messagerie',
        name: 'AdminMessagerie',
        component: AdminChatView,
        meta: {
          labelKey: 'admin.messaging',
          icon: 'MessageSquare',
          color: '#3B82F6',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'statistiques',
        name: 'AdminStats',
        component: AdminStatsView,
        meta: {
          labelKey: 'admin.stats',
          icon: 'BarChart3',
          color: '#10B981',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/features/faq/FaqView.vue'),
    meta: {
      labelKey: 'nav.faq',
      icon: 'HelpCircle',
      order: 4,
      headingKey: 'faq.title',
      titleKey: 'routes.faq.title',
      descriptionKey: 'routes.faq.description',
      badgeKey: 'routes.faq.badge',
      headerIcon: 'HelpCircle',
    },
  },
  {
    path: '/cgu',
    name: 'cgu',
    component: () => import('@/features/interface/cgu/CGU.vue'),
    meta: {
      titleKey: 'routes.cgu.title',
      headingKey: 'routes.cgu.heading',
      descriptionKey: 'routes.cgu.description',
    },
  },
  {
    path: '/guide-reconstitution',
    name: 'reconstitution',
    component: () => import('@/features/reconstitution/ReconstitutionView.vue'),
    meta: {
      labelKey: 'reconstitution.title',
      icon: 'Calculator',
      order: 3,
      titleKey: 'routes.reconstitution.title',
      headingKey: 'routes.reconstitution.heading',
      descriptionKey: 'routes.reconstitution.description',
      badgeKey: 'routes.reconstitution.badge',
      headerIcon: 'FlaskRound',
    },
  },
]

routes.push({
  path: '/:pathMatch(.*)*',
  redirect: '/',
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

registerBaseGuard(router)
export default router
