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
      title: 'Accueil – Fast Peptides',
      description:
        'Découvrez Fast Peptides, la référence européenne pour les peptides de recherche certifiés et livrés rapidement.',
    },
  },

  // 🔑 Auth pages (utilisent AuthForm.vue)
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/LoginView.vue'),
    meta: {
      title: 'Connexion – Fast Peptides',
      description:
        'Connectez-vous à votre compte Fast Peptides pour accéder à vos commandes et produits.',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/features/auth/RegisterView.vue'),
    meta: {
      title: 'Inscription – Fast Peptides',
      description:
        'Créez un compte Fast Peptides et bénéficiez de produits certifiés et d’un suivi personnalisé.',
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/features/auth/ResetPasswordView.vue'),
    meta: {
      title: 'Mot de passe oublié – Fast Peptides',
      description: 'Recevez un lien pour réinitialiser votre mot de passe.',
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
  // ✅ Callback OAuth (Google/GitHub)
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@/features/auth/AuthCallbackView.vue'),
    meta: {
      title: 'Connexion en cours – Fast Peptides',
    },
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
    component: () => import('@/features/auth/ProfilView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mon profil – Fast Peptides',
      description:
        'Gérez vos informations personnelles et votre historique de commandes sur Fast Peptides.',
    },
  },

  // ... 🔽 (tes autres routes inchangées)
  {
    path: '/catalogue',
    name: 'catalogue',
    component: () => import('@/pages/Catalogue.vue'),
    meta: {
      requiresAuth: true,
      label: 'Catalogue',
      icon: 'folder-open',
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
    path: '/paiement',
    name: 'checkout',
    component: () => import('@/pages/CheckoutView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Paiement – Fast Peptides',
      description: 'Validez et payez votre commande de peptides en toute sécurité.',
    },
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/features/admin/OrdersAdminView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Commandes (Admin) – Fast Peptides',
    },
  },
  {
    path: '/admin/orders/:id',
    name: 'admin-order-detail',
    component: () => import('@/features/admin/OrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      getTitle: (route) => `Commande #${route.params.id as string} – Fast Peptides`,
    },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/features/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Administration – Fast Peptides' },
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
  {
    path: '/confirmation/:id',
    name: 'confirmation',
    component: () => import('@/features/shop/ConfirmationView.vue'),
    meta: {
      requiresAuth: true,
      getTitle: (route) => `Confirmation #${route.params.id as string} – Fast Peptides`,
    },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/features/admin/UsersAdminView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Utilisateurs (Admin) – Fast Peptides',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🧠 Middleware de navigation
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Assure-toi que la session est chargée avant toute navigation
  if (!auth.user) await auth.initAuth()

  // 🔒 Bloque les pages auth si déjà connecté
  if (auth.isAuthenticated && ['/login', '/register', '/reset-password'].includes(to.path)) {
    return { name: 'home' }
  }

  // 🔐 Protège les routes privées
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }, // ⬅️ on garde la route demandée
    }
  }

  // 🛡️ Vérifie les accès admin
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'access-denied' }
  }

  // 🧭 Met à jour le titre et description SEO
  const title =
    typeof to.meta.getTitle === 'function' ? to.meta.getTitle(to) : to.meta.title || 'Fast Peptides'

  document.title = title

  const descriptionTag = document.querySelector('meta[name="description"]')
  const description =
    typeof to.meta.getDescription === 'function'
      ? to.meta.getDescription(to)
      : to.meta.description || 'Peptides de recherche certifiés, livrés rapidement en Europe.'

  if (descriptionTag) {
    descriptionTag.setAttribute('content', description)
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = description
    document.head.appendChild(meta)
  }

  return true
})

export default router
