import AdminNewsTable from '@/features/admin/news/AdminNewsView.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsView.vue'
import AdminTopicsTable from '@/features/admin/topics/AdminTopicsView.vue'
import AdminUsersView from '@/features/admin/users/AdminUsersView.vue'
import AdminChatView from '@/features/chat/admin/AdminChatView.vue'
import AdminStatsView from '@/features/stats/AdminStatsView.vue'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import './RouteMeta'
import { registerBaseGuard } from './registerBaseGuard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      label: 'Accueil',
      icon: 'Home',
      order: 1,
      title: 'Accueil – Fast Peptides',
      description: 'La référence européenne pour les peptides de recherche certifiés.',
    },
  },
  {
    path: '/auth',
    component: () => import('@/features/auth/AuthOverlay.vue'),
    children: [
      {
        path: 'callback',
        name: 'auth-callback',
        component: () => import('@/features/auth/AuthCallback.vue'),
        meta: {
          title: 'Connexion en cours – Fast Peptides',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/features/auth/AuthOverlay.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/features/auth/AuthLogin.vue'),
      },
      {
        path: 'register',
        name: 'auth-register',
        component: () => import('@/features/auth/AuthRegister.vue'),
      },
      {
        path: 'reset-password',
        name: 'auth-reset',
        component: () => import('@/features/auth/AuthReset.vue'),
      },
      {
        path: 'email-sent',
        name: 'email-sent',
        component: () => import('@/features/auth/AuthEmailSent.vue'),
      },
      {
        path: 'callback',
        name: 'auth-callback',
        component: () => import('@/features/auth/AuthCallback.vue'),
        meta: {
          title: 'Connexion en cours – Fast Peptides',
        },
      },
    ],
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/features/profile/ProfilView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mon profil – Fast Peptides',
      description: 'Gérez vos informations personnelles, préférences et sécurité de votre compte.',
    },
  },
  {
    path: '/profil/commandes',
    name: 'orders',
    component: () => import('@/features/order/OrdersView.vue'),
    meta: {
      requiresAuth: true,
      heading: 'Mes commandes',
      title: 'Mes commandes – Fast Peptides',
      description: 'Retrouvez toutes vos commandes précédentes sur Fast Peptides.',
    },
  },
  {
    path: '/profil/commandes/:id',
    name: 'order-detail',
    component: () => import('@/features/order/OrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      getTitle: (route) => `Commande #${route.params.id as string} – Fast Peptides`,
    },
  },
  {
    path: '/update-password',
    name: 'update-password',
    component: () => import('@/features/auth/UpdatePasswordView.vue'),
    meta: {
      title: 'Nouveau mot de passe – Fast Peptides',
      description: 'Choisissez un nouveau mot de passe pour accéder à votre compte Fast Peptides.',
    },
  },
  {
    path: '/update-password/success',
    name: 'update-password-success',
    component: () => import('@/features/auth/UpdatePasswordSuccessView.vue'),
    meta: {
      title: 'Mot de passe mis à jour – Fast Peptides',
      description: 'Votre mot de passe a été modifié avec succès.',
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/features/auth/AccessDeniedView.vue'),
    meta: { title: 'Accès refusé – Fast Peptides' },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/features/catalogue/Catalogue.vue'),
    meta: {
      label: 'Catalogue',
      icon: 'Boxes',
      order: 2,
      title: 'Catalogue – Fast Peptides',
      heading: 'Notre catalogue',
      description: 'Découvrez l’ensemble de nos peptides & produits disponibles pour la recherche.',
    },
  },
  {
    path: '/catalogue/:id',
    name: 'product-detail',
    component: () => import('@/features/catalogue/ProductDetails.vue'),
    meta: {
      title: 'Produit – Fast Peptides',
      getDescription: (route) =>
        `Découvrez le peptide ${route.params.id as string} sur Fast Peptides.`,
    },
  },
  {
    path: '/actualites',
    name: 'actualites',
    component: () => import('@/features/actualités/ActualitesView.vue'),
    meta: {
      label: 'Actualités',
      icon: 'Newspaper',
      order: 3,
      heading: 'Nos actualités',
      title: 'Actualités – Fast Peptides',
      description: 'Derniers articles, recherches & informations importantes',
    },
  },
  {
    path: '/actualites/:slug',
    name: 'actualite-detail',
    component: () => import('@/features/actualités/ActualiteDetailView.vue'),
    meta: {
      getTitle: (route) => `${route.params.slug as string} – Actualités Peptides – Fast Peptides`,
      description: 'Découvrez les détails de cette actualité sur Fast Peptides.',
    },
  },
  {
    path: '/panier',
    name: 'cart',
    component: () => import('@/pages/PanierView.vue'),
    meta: {
      requiresAuth: true,
      heading: 'Mon panier',
      title: 'Mon panier – Fast Peptides',
      description: 'Vérifiez vos articles, ajustez les quantités et validez votre commande.',
    },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/features/checkout/CheckoutView.vue'),
    meta: {
      requiresCart: true,
      requiresAuth: true,
      heading: 'Paiement',
      title: 'Paiement – Fast Peptides',
      description: 'Finalisez votre commande en toute sécurité.',
    },
  },
  {
    path: '/paiement',
    component: () => import('@/features/checkout/paiement/PaymentResultWrapper.vue'),
    children: [
      {
        path: 'success',
        name: 'payment-success',
        component: () => import('@/features/checkout/paiement/PaymentSuccessView.vue'),
        meta: {
          title: 'Paiement réussi – Fast Peptides',
          description: 'Votre paiement a été validé avec succès. Merci pour votre commande !',
        },
      },
      {
        path: 'cancel',
        name: 'payment-cancel',
        component: () => import('@/features/checkout/paiement/PaymentCancelView.vue'),
        meta: {
          title: 'Paiement annulé – Fast Peptides',
          description: 'Votre paiement a été interrompu ou annulé.',
        },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/features/admin/AdminTabsView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      heading: 'Espace administrateur',
      title: 'Espace administrateur – Fast Peptides',
      description:
        'Gérez les produits, utilisateurs, commandes, statistiques et actualités du site Fast Peptides.',
    },
    redirect: { name: 'AdminUsers' },
    children: [
      {
        path: 'utilisateurs',
        name: 'AdminUsers',
        component: AdminUsersView,
        meta: { label: 'Utilisateurs', icon: 'Users' },
      },
      {
        path: 'commandes',
        name: 'AdminOrders',
        component: AdminOrdersView,
        meta: { label: 'Commandes', icon: 'ShoppingCart' },
      },
      {
        path: 'produits',
        name: 'AdminProducts',
        component: AdminProductsTable,
        meta: { label: 'Produits', icon: 'PackageSearch' },
      },
      {
        path: 'actualites',
        name: 'AdminNews',
        component: AdminNewsTable,
        meta: { label: 'Actualités', icon: 'Newspaper' },
      },
      {
        path: 'topics',
        name: 'AdminTopics',
        component: AdminTopicsTable,
        meta: { label: 'Catégories', icon: 'FolderTree' },
      },
      {
        path: 'messagerie',
        name: 'AdminMessagerie',
        component: AdminChatView,
        meta: {
          label: 'Messagerie',
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
          label: 'Statistiques',
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
    component: () => import('@/pages/FaqView.vue'),
    meta: {
      label: 'FAQ',
      icon: 'HelpCircle',
      order: 4,
      heading: 'Foire aux questions',
      title: 'FAQ – Fast Peptides',
      description:
        'Produits destinés exclusivement à la recherche (RUO). Non destinés à l’usage humain ou vétérinaire.',
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
