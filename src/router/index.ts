import AdminNewsTable from '@/features/admin/news/AdminNewsView.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsView.vue'
import AdminPromoCodesView from '@/features/admin/promo/AdminPromoCodesView.vue'
import AdminSessionsView from '@/features/admin/sessions/AdminSessionsView.vue'
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
      {
        path: 'mfa-setup',
        name: 'mfa-setup',
        component: () => import('@/features/auth/AdminMfaSetup.vue'),
        meta: { titleKey: 'Configuration MFA', requiresAuth: true },
      },
      {
        path: 'mfa-challenge',
        name: 'mfa-challenge',
        component: () => import('@/features/auth/AdminMfaChallenge.vue'),
        meta: { titleKey: 'Vérification MFA', requiresAuth: true },
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
    path: '/catalogue/:slug',
    name: 'product-detail',
    component: () => import('@/features/catalogue/ProductDetails.vue'),
    meta: {
      titleKey: 'routes.product.title',
    },
  },
  {
    path: '/favoris',
    name: 'favorites',
    component: () => import('@/features/catalogue/FavoritesView.vue'),
    meta: {
      titleKey: 'routes.favorites.title',
      headingKey: 'routes.favorites.heading',
      descriptionKey: 'routes.favorites.description',
      headerIcon: 'Heart',
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
  // Section "Lab Notes" - Ressources techniques (séparées des actualités)
  {
    path: '/ressources',
    name: 'ressources',
    component: () => import('@/features/resources/ResourcesListView.vue'),
    meta: {
      labelKey: 'nav.resources',
      icon: 'FlaskConical',
      order: 4,
      headingKey: 'routes.resources.heading',
      titleKey: 'routes.resources.title',
      descriptionKey: 'routes.resources.description',
      headerIcon: 'FlaskConical',
    },
  },
  {
    path: '/ressources/:slug',
    name: 'ressource-detail',
    component: () => import('@/features/resources/ResourceDetailView.vue'),
    meta: {
      descriptionKey: 'routes.resourceDetail.description',
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
  // Glossaire scientifique (SEO longue traîne)
  {
    path: '/glossaire',
    name: 'glossaire',
    component: () => import('@/features/glossaire/GlossaireView.vue'),
    meta: {
      labelKey: 'nav.glossary',
      icon: 'BookOpen',
      order: 5,
      headingKey: 'routes.glossary.heading',
      titleKey: 'routes.glossary.title',
      descriptionKey: 'routes.glossary.description',
      headerIcon: 'BookOpen',
    },
  },
  {
    path: '/glossaire/:slug',
    name: 'glossaire-detail',
    component: () => import('@/features/glossaire/GlossaireDetailView.vue'),
    meta: {
      descriptionKey: 'routes.glossaryDetail.description',
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
    path: '/checkout/confirmation',
    name: 'checkout-confirmation',
    component: () => import('@/features/checkout/OrderConfirmation.vue'),
    meta: { titleKey: 'checkout.confirmation.pageTitle' },
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
        path: 'crypto-matching',
        name: 'AdminCryptoMatching',
        component: () => import('@/features/admin/crypto-matching/AdminCryptoMatchingView.vue'),
        meta: { labelKey: 'admin.cryptoMatching', icon: 'wallet' },
      },
      {
        path: 'produits',
        name: 'AdminProducts',
        component: AdminProductsTable,
        meta: { labelKey: 'admin.products', icon: 'PackageSearch' },
      },
      {
        path: 'codes-promo',
        name: 'AdminPromoCodes',
        component: AdminPromoCodesView,
        meta: { labelKey: 'admin.promo', icon: 'Tag' },
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
        path: 'glossaire',
        name: 'AdminGlossary',
        component: () => import('@/features/admin/glossary/AdminGlossaryView.vue'),
        meta: { labelKey: 'admin.glossary', icon: 'BookOpen' },
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
      {
        path: 'connexions',
        name: 'AdminSessions',
        component: AdminSessionsView,
        meta: {
          labelKey: 'admin.sessions',
          icon: 'Activity',
          color: '#8B5CF6',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
  {
    path: '/a-propos',
    name: 'about',
    component: () => import('@/features/about/AboutView.vue'),
    meta: {
      title: 'À propos – Fast Peptides',
    },
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
  {
    path: '/guide-crypto',
    name: 'crypto-guide',
    component: () => import('@/features/crypto-guide/CryptoGuideView.vue'),
    meta: {
      titleKey: 'routes.cryptoGuide.title',
      headingKey: 'routes.cryptoGuide.heading',
      descriptionKey: 'routes.cryptoGuide.description',
      headerIcon: 'Bitcoin',
    },
  },
  // Newsletter
  {
    path: '/newsletter/confirm',
    name: 'newsletter-confirm',
    component: () => import('@/features/newsletter/pages/NewsletterConfirmView.vue'),
    meta: {
      titleKey: 'routes.newsletter.confirm',
    },
  },
  {
    path: '/newsletter/unsubscribe',
    name: 'newsletter-unsubscribe',
    component: () => import('@/features/newsletter/pages/NewsletterUnsubscribeView.vue'),
    meta: {
      titleKey: 'routes.newsletter.unsubscribe',
    },
  },
  {
    path: '/emails/optout',
    name: 'nurturing-optout',
    component: () => import('@/features/newsletter/pages/NurturingOptoutView.vue'),
    meta: {
      titleKey: 'routes.nurturing.optout',
    },
  },
  // Pages légales
  {
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: () => import('@/features/legal/MentionsLegalesView.vue'),
    meta: {
      titleKey: 'routes.legal.mentions',
    },
  },
  {
    path: '/politique-confidentialite',
    name: 'politique-confidentialite',
    component: () => import('@/features/legal/PolitiqueConfidentialiteView.vue'),
    meta: {
      titleKey: 'routes.legal.privacy',
    },
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('@/features/legal/CookiesView.vue'),
    meta: {
      titleKey: 'routes.legal.cookies',
    },
  },
  {
    path: '/status',
    name: 'status',
    component: () => import('@/features/status/StatusView.vue'),
    meta: {
      titleKey: 'routes.status.title',
      headingKey: 'routes.status.heading',
      descriptionKey: 'routes.status.description',
      headerIcon: 'Activity',
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

/**
 * Utilitaire pour déterminer la route de redirection après login
 * @param role - Le rôle de l'utilisateur ('admin' | 'user')
 * @param requestedRedirect - La route demandée initialement (optionnel)
 * @returns La route de destination
 */
export function getPostLoginRedirect(role: string, requestedRedirect?: string | null): string {
  // Si admin -> toujours vers /admin (sauf si redirect spécifique vers une route admin)
  if (role === 'admin') {
    // Si une redirection vers une route admin était demandée, on la respecte
    if (requestedRedirect?.startsWith('/admin')) {
      return requestedRedirect
    }
    // Sinon, direction /admin par défaut
    return '/admin'
  }

  // Si utilisateur standard avec une redirection demandée (non-admin)
  if (requestedRedirect && !requestedRedirect.startsWith('/admin')) {
    return requestedRedirect
  }

  // Par défaut pour un utilisateur standard -> /profil
  return '/profil'
}

export default router
