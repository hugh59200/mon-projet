// ============================================================
// 🛒 useCartStore — V3.0 (Guest Checkout + Pinia Persist)
// ============================================================
import defaultImage from '@/assets/products/default/default-product-image.png'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import type { CartItems, CartView, Products } from '@/supabase/types/supabase.types'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCartStore = defineStore(
  'cart',
  () => {
    const auth = useAuthStore()

    // ============================================================
    // 💾 État
    // ============================================================
    // items : La liste active affichée dans l'UI (soit DB, soit Guest)
    const items = ref<CartView[]>([])
    
    // guestCart : La liste persistée dans le localStorage (Source de vérité pour l'invité)
    const guestCart = ref<CartView[]>([])

    const isSyncing = ref(false)
    let channel: RealtimeChannel | null = null

    // ============================================================
    // 🧰 Helpers
    // ============================================================
    function safeImage(src?: string | null) {
      return src && src.trim() !== '' ? src : defaultImage
    }

    // ============================================================
    // 📥 Charger le panier (DB ou Local)
    // ============================================================
    async function loadCart() {
      if (auth.user?.id) {
        await loadCartFromSupabase()
      } else {
        // Mode invité : on charge depuis le state persisté
        items.value = [...guestCart.value]
      }
    }

    async function loadCartFromSupabase() {
      if (isSyncing.value || !auth.user?.id) return
      isSyncing.value = true
      try {
        const { data, error } = await supabase
          .from('user_cart_view')
          .select('*')
          .eq('user_id', auth.user.id)

        if (error) throw error

        items.value = (data ?? []).map((i) => ({
          ...i,
          product_image: safeImage(i.product_image),
        }))
      } catch (e) {
        console.warn('Erreur panier DB:', e)
      } finally {
        isSyncing.value = false
      }
    }

    // ============================================================
    // 📤 Actions Panier (Unifiées)
    // ============================================================
    async function addToCart(product: Products) {
      // 1. Mode Connecté (DB)
      if (auth.user?.id) {
        const existing = items.value.find((i) => i.product_id === product.id)
        if (existing) {
          await updateQuantity(product.id, (existing.quantity ?? 0) + 1)
        } else {
          const payload: Omit<CartItems, 'id' | 'updated_at'> = {
            user_id: auth.user.id,
            product_id: product.id,
            quantity: 1,
          }
          await supabase.from('user_cart_items').insert(payload)
          await loadCartFromSupabase()
        }
      } 
      // 2. Mode Invité (Local)
      else {
        const existingIndex = guestCart.value.findIndex((i) => i.product_id === product.id)
        
        if (existingIndex >= 0) {
          guestCart.value[existingIndex]!.quantity = (guestCart.value[existingIndex]!.quantity ?? 0) + 1
        } else {
          // Création d'un objet CartView factice pour le front
          guestCart.value.push({
            cart_item_id: `guest_${Date.now()}`,
            user_id: 'guest',
            product_id: product.id,
            product_name: product.name,
            product_dosage: product.dosage,
            product_category: product.category,
            product_price: product.price,
            product_sale_price: product.sale_price,
            is_on_sale: product.is_on_sale,
            product_image: safeImage(product.image),
            product_stock: product.stock,
            product_purity: product.purity,
            quantity: 1,
            updated_at: new Date().toISOString()
          })
        }
        // Synchro vers items pour l'affichage
        items.value = [...guestCart.value]
      }
    }

    async function updateQuantity(productId: string, quantity: number) {
      if (quantity <= 0) return removeFromCart(productId)

      if (auth.user?.id) {
        await supabase
          .from('user_cart_items')
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq('user_id', auth.user.id)
          .eq('product_id', productId)
        await loadCartFromSupabase()
      } else {
        const index = guestCart.value.findIndex((i) => i.product_id === productId)
        if (index >= 0) {
          guestCart.value[index]!.quantity = quantity
          items.value = [...guestCart.value]
        }
      }
    }

    async function removeFromCart(productId: string) {
      if (auth.user?.id) {
        await supabase
          .from('user_cart_items')
          .delete()
          .eq('user_id', auth.user.id)
          .eq('product_id', productId)
        await loadCartFromSupabase()
      } else {
        guestCart.value = guestCart.value.filter((i) => i.product_id !== productId)
        items.value = [...guestCart.value]
      }
    }

    async function clearCart() {
      if (auth.user?.id) {
        await supabase.from('user_cart_items').delete().eq('user_id', auth.user.id)
        await loadCartFromSupabase()
      } else {
        guestCart.value = []
        items.value = []
      }
    }

    // ============================================================
    // 🔄 Fusion Panier Invité -> Compte (au login)
    // ============================================================
    async function mergeGuestCart() {
      if (!auth.user?.id || guestCart.value.length === 0) return

      // Pour chaque item invité, on l'ajoute au compte
      for (const item of guestCart.value) {
        if (!item.product_id) continue
        
        // Vérif existence pour éviter doublons/erreurs
        const { data: existing } = await supabase
           .from('user_cart_items')
           .select('quantity')
           .eq('user_id', auth.user.id)
           .eq('product_id', item.product_id)
           .maybeSingle()

        if (existing) {
           // On additionne
           await supabase.from('user_cart_items')
             .update({ quantity: existing.quantity + (item.quantity ?? 1) })
             .eq('user_id', auth.user.id)
             .eq('product_id', item.product_id)
        } else {
           // On insère
           await supabase.from('user_cart_items').insert({
              user_id: auth.user.id,
              product_id: item.product_id,
              quantity: item.quantity ?? 1
           })
        }
      }
      // Une fois fusionné, on vide le panier local invité
      guestCart.value = []
      await loadCartFromSupabase()
    }

    // ============================================================
    // ⚡ Realtime
    // ============================================================
    function setupRealtime() {
      if (!auth.user?.id) return
      cleanupRealtime()
      channel = supabase
        .channel(`cart:${auth.user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_cart_items', filter: `user_id=eq.${auth.user.id}` }, async () => {
          await loadCartFromSupabase()
        })
        .subscribe()
    }

    function cleanupRealtime() {
      if (channel) {
        supabase.removeChannel(channel)
        channel = null
      }
    }

    // ============================================================
    // 👀 Watch Auth State
    // ============================================================
    watch(() => auth.user, async (user) => {
      if (user) {
        // Connexion : Fusionner le panier local vers la DB
        await mergeGuestCart()
        await loadCartFromSupabase()
        setupRealtime()
      } else {
        // Déconnexion : On affiche le panier invité (s'il en reste un, sinon vide)
        cleanupRealtime()
        items.value = [...guestCart.value]
      }
    }, { immediate: true })

    // ============================================================
    // 🧮 Computed
    // ============================================================
    const totalItems = computed(() => items.value.reduce((sum, i) => sum + Number(i.quantity ?? 0), 0))
    
    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => {
        const qty = Number(item.quantity ?? 0)
        const unitPrice = item.is_on_sale
          ? Number(item.product_sale_price ?? item.product_price ?? 0)
          : Number(item.product_price ?? 0)
        return sum + unitPrice * qty
      }, 0),
    )

    return {
      items,
      guestCart, // On expose guestCart pour que Pinia puisse le persister
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart,
    }
  },
  {
    persist: {
      key: 'fp-cart-storage', // Clé dans le localStorage
      storage: localStorage,
      // ⚠️ IMPORTANT : On ne persiste QUE 'guestCart'.
      // 'items' est recalculé à chaque chargement (soit depuis DB, soit depuis guestCart).
      pick: ['guestCart'], 
    },
  },
)