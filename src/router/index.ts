import AdminChatView from '@/features/admin/chat/AdminChatView.vue'
import AdminNewsTable from '@/features/admin/news/AdminNewsTable.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsTable.vue'
import AdminStatsView from '@/features/admin/stats/AdminStatsView.vue'
import AdminTopicsTable from '@/features/admin/topics/AdminTopicsTable.vue'
import AdminUsersView from '@/features/admin/users/AdminUsersView.vue'
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
  {
    path: '/auth',
    component: () => import('@/features/auth/AuthWrapper.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/features/auth/LoginView.vue'),
        meta: { title: 'Connexion – Fast Peptides' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/features/auth/RegisterView.vue'),
        meta: { title: 'Inscription – Fast Peptides' },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/features/auth/ResetPasswordView.vue'),
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
    component: () => import('@/pages/ProfilView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mon profil – Fast Peptides',
      description:
        'Gérez vos informations personnelles et votre historique de commandes sur Fast Peptides.',
    },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/pages/Catalogue.vue'),
    meta: {
      requiresAuth: true,
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
    component: () => import('@/pages/ProductView.vue'),
    meta: {
      requiresAuth: true,
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
      icon: 'Newspaper', // ou un autre nom d’icône présent dans ton design system
      order: 3, // pour qu’elle s’affiche après Catalogue
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
    children: [
      {
        path: 'messagerie',
        name: 'AdminMessagerie',
        component: AdminChatView,
        meta: {
          label: 'Messagerie',
          icon: 'MessageSquare',
          title: 'Messagerie – Fast Peptides',
          description: 'Discutez avec les utilisateurs et suivez les conversations clients.',
        },
      },
      {
        path: 'stats',
        name: 'AdminStats',
        component: AdminStatsView,
        meta: {
          label: 'Statistiques',
          icon: 'BarChart3',
          title: 'Statistiques – Fast Peptides',
          description: 'Consultez les données de performance et les indicateurs clés du site.',
        },
      },
      {
        path: 'utilisateurs',
        name: 'AdminUsers',
        component: AdminUsersView,
        meta: {
          label: 'Utilisateurs',
          icon: 'Users',
          title: 'Utilisateurs – Fast Peptides',
          description:
            'Gérez les comptes clients, les droits d’accès et les informations de profil.',
        },
      },
      {
        path: 'commandes',
        name: 'AdminOrders',
        component: AdminOrdersView,
        meta: {
          label: 'Commandes',
          icon: 'ShoppingCart',
          title: 'Commandes – Fast Peptides',
          description: 'Suivez et gérez les commandes en cours ou terminées sur la plateforme.',
        },
      },
      {
        path: 'produits',
        name: 'AdminProducts',
        component: AdminProductsTable,
        meta: {
          label: 'Produits',
          icon: 'PackageSearch',
          title: 'Produits – Fast Peptides',
          description: 'Ajoutez, modifiez ou supprimez les peptides disponibles dans le catalogue.',
        },
      },
      {
        path: 'actualites',
        name: 'AdminNews',
        component: AdminNewsTable,
        meta: {
          label: 'Actualités',
          icon: 'Newspaper',
          title: 'Actualités – Fast Peptides',
          description: 'Publiez les dernières études, nouvelles et annonces importantes.',
        },
      },
      {
        path: 'topics',
        name: 'AdminTopics',
        component: AdminTopicsTable,
        meta: {
          label: 'Catégories',
          icon: 'FolderTree',
          title: 'Catégories – Fast Peptides',
          description: 'Organisez vos produits et articles par thématique de recherche.',
        },
      },
    ],
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
