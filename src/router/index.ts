/* -------------------------------------------------------------------------- */
/* 📦 IMPORTS SYNCHRONES (remplacement des () => import(...))                */
/* -------------------------------------------------------------------------- */

import AdminNewsTable from '@/features/admin/news/AdminNewsView.vue'
import AdminOrdersView from '@/features/admin/orders/AdminOrdersView.vue'
import AdminProductsTable from '@/features/admin/products/AdminProductsView.vue'
import AdminTopicsTable from '@/features/admin/topics/AdminTopicsView.vue'
import AdminUsersView from '@/features/admin/users/AdminUsersView.vue'
import AdminChatView from '@/features/chat/admin/AdminChatView.vue'
import AdminStatsView from '@/features/stats/AdminStatsView.vue'

import Home from '@/pages/Home.vue'

/* AUTH */
import AccessDeniedView from '@/features/auth/AccessDeniedView.vue'
import AuthCallback from '@/features/auth/AuthCallback.vue'
import AuthEmailSent from '@/features/auth/AuthEmailSent.vue'
import AuthLogin from '@/features/auth/AuthLogin.vue'
import AuthOverlay from '@/features/auth/AuthOverlay.vue'
import AuthRegister from '@/features/auth/AuthRegister.vue'
import AuthReset from '@/features/auth/AuthReset.vue'
import UpdatePasswordSuccessView from '@/features/auth/UpdatePasswordSuccessView.vue'
import UpdatePasswordView from '@/features/auth/UpdatePasswordView.vue'

/* PROFIL */
import OrderDetailView from '@/features/order/OrderDetailView.vue'
import OrdersView from '@/features/order/OrdersView.vue'
import ProfilView from '@/features/profile/ProfilView.vue'

/* CATALOGUE */
import Catalogue from '@/features/catalogue/Catalogue.vue'
import ProductDetails from '@/features/catalogue/ProductDetails.vue'

/* ACTUALITÉS */
import ActualiteDetailView from '@/features/actualités/ActualiteDetailView.vue'
import ActualitesView from '@/features/actualités/ActualitesView.vue'

/* CHECKOUT */
import CheckoutView from '@/features/checkout/CheckoutView.vue'
import PaymentCancelView from '@/features/checkout/paiement/PaymentCancelView.vue'
import PaymentResultWrapper from '@/features/checkout/paiement/PaymentResultWrapper.vue'
import PaymentSuccessView from '@/features/checkout/paiement/PaymentSuccessView.vue'
import PanierView from '@/pages/PanierView.vue'

/* FAQ */
import FaqView from '@/pages/FaqView.vue'

/* ROUTER CORE */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import './RouteMeta'
import { registerBaseGuard } from './registerBaseGuard'

/* -------------------------------------------------------------------------- */
/* 📌 ROUTES (strictement identiques, seul "component:" change)              */
/* -------------------------------------------------------------------------- */
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
    component: AuthOverlay,
    children: [
      {
        path: 'callback',
        name: 'auth-callback',
        component: AuthCallback,
        meta: { title: 'Connexion en cours – Fast Peptides' },
      },
    ],
  },

  {
    path: '/auth',
    component: AuthOverlay,
    children: [
      { path: 'login', name: 'auth-login', component: AuthLogin },
      { path: 'register', name: 'auth-register', component: AuthRegister },
      { path: 'reset-password', name: 'auth-reset', component: AuthReset },
      { path: 'email-sent', name: 'email-sent', component: AuthEmailSent },
      {
        path: 'callback',
        name: 'auth-callback',
        component: AuthCallback,
        meta: { title: 'Connexion en cours – Fast Peptides' },
      },
    ],
  },

  {
    path: '/profil',
    name: 'profil',
    component: ProfilView,
    meta: {
      requiresAuth: true,
      title: 'Mon profil – Fast Peptides',
      description: 'Gérez vos informations personnelles, préférences et sécurité de votre compte.',
    },
  },

  {
    path: '/profil/commandes',
    name: 'orders',
    component: OrdersView,
    meta: {
      requiresAuth: true,
      title: 'Mes commandes – Fast Peptides',
      description: 'Retrouvez toutes vos commandes précédentes sur Fast Peptides.',
    },
  },

  {
    path: '/profil/commandes/:id',
    name: 'order-detail',
    component: OrderDetailView,
    meta: {
      requiresAuth: true,
      getTitle: (route) => `Commande #${route.params.id as string} – Fast Peptides`,
    },
  },

  {
    path: '/update-password',
    name: 'update-password',
    component: UpdatePasswordView,
    meta: {
      title: 'Nouveau mot de passe – Fast Peptides',
      description: 'Choisissez un nouveau mot de passe pour accéder à votre compte Fast Peptides.',
    },
  },

  {
    path: '/update-password/success',
    name: 'update-password-success',
    component: UpdatePasswordSuccessView,
    meta: {
      title: 'Mot de passe mis à jour – Fast Peptides',
      description: 'Votre mot de passe a été modifié avec succès.',
    },
  },

  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView,
    meta: { title: 'Accès refusé – Fast Peptides' },
  },

  {
    path: '/catalogue',
    name: 'catalogue',
    component: Catalogue,
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
    component: ProductDetails,
    meta: {
      title: 'Produit – Fast Peptides',
      getDescription: (route) =>
        `Découvrez le peptide ${route.params.id as string} sur Fast Peptides.`,
    },
  },

  {
    path: '/actualites',
    name: 'actualites',
    component: ActualitesView,
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
    component: ActualiteDetailView,
    meta: {
      getTitle: (route) => `${route.params.slug as string} – Actualités Peptides – Fast Peptides`,
      description: 'Découvrez les détails de cette actualité sur Fast Peptides.',
    },
  },

  {
    path: '/panier',
    name: 'cart',
    component: PanierView,
    meta: {
      requiresAuth: true,
      title: 'Mon panier – Fast Peptides',
      description: 'Consultez les produits ajoutés à votre panier avant de valider votre commande.',
    },
  },

  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: {
      requiresCart: true,
      requiresAuth: true,
      title: 'Paiement – Fast Peptides',
      description: 'Validez et payez votre commande de peptides en toute sécurité.',
    },
  },

  {
    path: '/paiement',
    component: PaymentResultWrapper,
    children: [
      {
        path: 'success',
        name: 'payment-success',
        component: PaymentSuccessView,
        meta: {
          title: 'Paiement réussi – Fast Peptides',
          description: 'Votre paiement a été validé avec succès. Merci pour votre commande !',
        },
      },
      {
        path: 'cancel',
        name: 'payment-cancel',
        component: PaymentCancelView,
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
      title: 'Espace administrateur – Fast Peptides',
      description:
        'Gérez les produits, utilisateurs, commandes, statistiques et actualités du site Fast Peptides.',
    },
    redirect: { name: 'AdminUsers' },
    children: [
      { path: 'utilisateurs', name: 'AdminUsers', component: AdminUsersView },
      { path: 'commandes', name: 'AdminOrders', component: AdminOrdersView },
      { path: 'produits', name: 'AdminProducts', component: AdminProductsTable },
      { path: 'actualites', name: 'AdminNews', component: AdminNewsTable },
      { path: 'topics', name: 'AdminTopics', component: AdminTopicsTable },
      { path: 'messagerie', name: 'AdminMessagerie', component: AdminChatView },
      { path: 'statistiques', name: 'AdminStats', component: AdminStatsView },
    ],
  },

  {
    path: '/faq',
    name: 'faq',
    component: FaqView,
    meta: {
      label: 'FAQ',
      icon: 'HelpCircle',
      order: 4,
      title: 'FAQ – Fast Peptides',
      description:
        'Questions fréquentes sur la qualité, la manipulation, l’expédition et la conformité (RUO) des peptides.',
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