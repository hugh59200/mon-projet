import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'
import { useAfficheCGUStore } from '@/features/interface/cgu/useAfficheCGUStore'
import { supabase } from '@/services/supabaseClient'
import type { Router } from 'vue-router'

/**
 * 🧠 Guard global :
 * - Vérifie session et profil
 * - Bloque si email non confirmé
 * - Déclenche popup CGU si nécessaire
 * - Vérifie panier / maintenance
 */
export function registerBaseGuard(router: Router) {
  let isShowingCGU = false // 🔒 évite popup multiple

  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ✅ 1. Initialisation session Supabase si pas encore fait
    if (!auth.user) {
      await auth.initAuth()
    }

    // 🚨 2. Bloque l’accès si l’email n’est pas confirmé
    if (auth.user && !auth.user.email_confirmed_at) {
      console.warn('[Guard] Email non confirmé → redirection vers /auth/login')
      await supabase.auth.signOut()
      return '/auth/login'
    }

    // ✅ 3. Recharge profil si besoin (après connexion)
    if (auth.isAuthenticated && !auth.profile) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user!.id)
        .maybeSingle()

      if (error) console.warn('[Guard] Erreur chargement profil:', error)
      if (!profile || !profile.email) {
        console.warn('[Guard] Aucun profil lié ou email manquant → déconnexion forcée')
        await supabase.auth.signOut()
        return '/auth/login'
      }

      auth.profile = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || undefined,
        role: (profile.role as 'admin' | 'user') || undefined,
      }
    }

    // ✅ 4. Vérifie CGU uniquement si connecté et pas sur route publique
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password']
    if (auth.isAuthenticated && !publicRoutes.includes(to.path) && !isShowingCGU) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('cgu_accepted')
          .eq('id', auth.user!.id)
          .maybeSingle()

        if (error) throw error

        // 🚨 CGU non acceptées → affiche popup obligatoire
        if (data && data.cgu_accepted === false) {
          console.info('[Guard] CGU non acceptées → affichage popup.')

          isShowingCGU = true
          const dialog = useAfficheCGUStore()
          await dialog.showDialog({ validationObligatoire: true })

          // ✅ Met à jour champ après validation
          await supabase
            .from('profiles')
            .update({
              cgu_accepted: true,
              cgu_accepted_at: new Date().toISOString(),
            })
            .eq('id', auth.user!.id)

          isShowingCGU = false
        }
      } catch (err) {
        console.warn('[Guard] Erreur vérification CGU :', err)
      }
    }

    // ✅ 5. Vérifie panier plein pour les routes protégées
    if (to.meta.requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    return true
  })
}
