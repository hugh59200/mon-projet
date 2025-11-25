import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Router } from 'vue-router'

export function registerBaseGuard(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ✅ 1. Toujours laisser passer la callback d'auth (sinon boucle infinie)
    if (to.path === '/auth/callback') return true

    // ✅ 2. Initialiser session si nécessaire
    if (!auth.user) {
      await auth.initAuth()
    }

    // ✅ 3. Vérification Email (Adapté pour OAuth)
    // Pour OAuth, 'email_confirmed_at' est souvent présent, mais parfois 'identities' contient l'info.
    // On ne bloque pas si l'utilisateur vient de Google (provider 'google') car Google vérifie les emails.
    if (auth.user) {
      const isOAuth = auth.user.app_metadata?.provider !== 'email'
      const isConfirmed =
        auth.user.email_confirmed_at || auth.user.identities?.[0]?.identity_data?.email_verified

      // Si ce n'est PAS du OAuth ET que l'email n'est pas confirmé => bloquer
      if (!isOAuth && !isConfirmed) {
        // On redirige vers une page spécifique ou login, mais attention aux boucles avec Callback
        // Pour l'instant, on peut le laisser passer ou rediriger vers une page "Vérifiez vos mails"
        // return '/auth/email-sent'
      }
    }

    // ✅ 4. Charger le profil manquant
    if (auth.isAuthenticated && !auth.profile) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user!.id)
        .maybeSingle()

      if (!profile) {
        // Cas rare : User Auth existe mais pas de profil publique -> Logout
        await supabase.auth.signOut()
        return '/auth/login'
      }

      auth.profile = profile
    }

    // ✅ 5. Routes protégées
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    // ✅ 6. Admin
    if (to.meta.requiresAdmin && auth.profile?.role !== 'admin') {
      return '/access-denied'
    }

    // ✅ 7. Panier obligatoire
    if (to.meta.requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    // ✅ 8. Si connecté → empêche retour sur /auth/login ou /auth/register
    if (auth.isAuthenticated && to.path.startsWith('/auth/') && to.path !== '/auth/callback') {
      return '/profil'
    }

    return true
  })
}
