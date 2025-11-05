import AdminNewsTable from '@/features/admin/news/AdminNewsTable.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsTable.vue'
import AdminTopicsTable from '@/features/admin/topics/AdminTopicsTable.vue'
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
      description:
        'Découvrez Fast Peptides, la référence européenne pour les peptides de recherche certifiés et livrés rapidement.',
    },
  },

  // AUTHENTIFICATION
  {
    path: '/auth',
    component: () => import('@/features/auth/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/features/auth/AuthForm.vue'),
        props: { mode: 'login' },
        meta: { title: 'Connexion – Fast Peptides' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/features/auth/AuthForm.vue'),
        props: { mode: 'register' },
        meta: { title: 'Inscription – Fast Peptides' },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/features/auth/AuthForm.vue'),
        props: { mode: 'reset' },
        meta: { title: 'Mot de passe oublié – Fast Peptides' },
      },
    ],
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
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@/features/auth/AuthCallbackView.vue'),
    meta: { title: 'Connexion en cours – Fast Peptides' },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/features/auth/AccessDeniedView.vue'),
    meta: { title: 'Accès refusé – Fast Peptides' },
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/features/profile/ProfilView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mon profil – Fast Peptides',
      description:
        'Gérez vos informations personnelles et votre historique de commandes sur Fast Peptides.',
    },
  },
  // ✅ ADMIN - vues hors onglets
  {
    path: '/admin/messagerie',
    name: 'AdminMessagerie',
    component: AdminChatView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      label: 'Messagerie',
      icon: 'MessageSquare',
      color: '#3B82F6',
      title: 'Messagerie – Fast Peptides',
      description: 'Discutez avec les utilisateurs ou le support via la messagerie interne.',
    },
  },
  {
    path: '/admin/statistiques',
    name: 'AdminStats',
    component: AdminStatsView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      label: 'Statistiques',
      icon: 'BarChart3',
      color: '#10B981',
      title: 'Statistiques – Fast Peptides',
      description: 'Consultez les statistiques globales du site Fast Peptides.',
    },
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
      description: 'Explorez notre catalogue complet de peptides de recherche de haute qualité.',
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
      title: 'Actualités – Fast Peptides',
      description:
        'Découvrez les dernières actualités, études et innovations dans le domaine des peptides sur Fast Peptides.',
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
      title: 'Mon panier – Fast Peptides',
      description: 'Consultez les produits ajoutés à votre panier avant de valider votre commande.',
    },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/features/checkout/CheckoutView.vue'),
    meta: {
      requiresCart: true,
      requiresAuth: true,
      title: 'Paiement – Fast Peptides',
      description: 'Validez et payez votre commande de peptides en toute sécurité.',
    },
  },
  {
    path: '/paiement',
    component: () => import('@/features/checkout/paiement/PaymentResultWrapper.vue'),
    children: [
      {
        path: 'result',
        name: 'payment-result',
        component: () => import('@/features/checkout/paiement/PaymentResultView.vue'),
        meta: {
          title: 'Vérification du paiement – Fast Peptides',
          description: 'Vérification de l’état du paiement en cours.',
        },
      },
      {
        path: 'success',
        name: 'payment-success',
        component: () => import('@/features/checkout/paiement/PaymentSuccessView.vue'),
        meta: {
          title: 'Paiement réussi – Fast Peptides',
          description: 'Votre paiement a été traité avec succès.',
        },
      },
      {
        path: 'cancel',
        name: 'payment-cancel',
        component: () => import('@/features/checkout/paiement/PaymentCancelView.vue'),
        meta: {
          title: 'Paiement annulé – Fast Peptides',
          description: 'Votre paiement a été annulé.',
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
        meta: {
          label: 'Utilisateurs',
          icon: 'Users',
          color: '#F59E0B',
        },
      },
      {
        path: 'commandes',
        name: 'AdminOrders',
        component: AdminOrdersView,
        meta: {
          label: 'Commandes',
          icon: 'ShoppingCart',
          color: '#EF4444',
        },
      },
      {
        path: 'produits',
        name: 'AdminProducts',
        component: AdminProductsTable,
        meta: {
          label: 'Produits',
          icon: 'PackageSearch',
          color: '#8B5CF6',
        },
      },
      {
        path: 'actualites',
        name: 'AdminNews',
        component: AdminNewsTable,
        meta: {
          label: 'Actualités',
          icon: 'Newspaper',
          color: '#F97316',
        },
      },
      {
        path: 'topics',
        name: 'AdminTopics',
        component: AdminTopicsTable,
        meta: {
          label: 'Catégories',
          icon: 'FolderTree',
          color: '#06B6D4',
        },
      },
    ],
  },

  // FAQ
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/pages/FaqView.vue'),
    meta: {
      label: 'FAQ',
      icon: 'HelpCircle',
      order: 4,
      title: 'FAQ – Fast Peptides',
      description:
        'Questions fréquentes sur la qualité, la manipulation, l’expédition et la conformité (RUO) des peptides.',
    },
  },
  {
    path: '/profil/commandes',
    name: 'user-orders',
    component: () => import('@/features/user/UserOrdersView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mes commandes – Fast Peptides',
      description: 'Retrouvez toutes vos commandes précédentes sur Fast Peptides.',
    },
  },
  {
    path: '/profil/commandes/:id',
    name: 'user-order-detail',
    component: () => import('@/features/user/UserOrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      getTitle: (route) => `Commande #${route.params.id as string} – Fast Peptides`,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

registerBaseGuard(router)

export default router
