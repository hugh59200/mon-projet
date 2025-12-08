// ============================================================
// 🛒 useCartStore — V4.0 (Guest Checkout + Pinia Persist - Simplified)
// ============================================================
import { DEFAULT_PRODUCT_IMAGE as defaultImage } from '@/config/productAssets'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { trackAddToCart } from '@/features/tracking/services/sessionTracker'
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { CartItems, Products } from '@/supabase/types/supabase.types'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = any

// Type simplifié pour éviter les erreurs "Type instantiation is excessively deep"
export interface SimpleCartItem {
  cart_item_id: string | null
  category_i18n: AnyJson
  is_on_sale: boolean | null
  name_i18n: AnyJson
  product_category: string | null
  product_dosage: string | null
  product_id: string | null
  product_image: string | null
  product_name: string | null
  product_price: number | null
  product_purity: number | null
  product_sale_price: number | null
  product_stock: number | null
  quantity: number | null
  updated_at: string | null
  user_id: string | null
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const auth = useAuthStore()

    // ============================================================
    // 💾 État
    // ============================================================
    // dbCart : Items depuis la DB (utilisateur connecté)
    const dbCart = ref<SimpleCartItem[]>([])

    // guestCart : Items persistés dans localStorage (invité)
    const guestCart = ref<SimpleCartItem[]>([])

    const isSyncing = ref(false)
    let channel: RealtimeChannel | null = null

    // ============================================================
    // 🎯 items = computed qui choisit la bonne source
    // ============================================================
    const items = computed((): SimpleCartItem[] => {
      const userId = auth.user?.id
      return userId ? dbCart.value : guestCart.value
    })

    // ============================================================
    // 🧰 Helpers
    // ============================================================
    function safeImage(src?: string | null) {
      return src && src.trim() !== '' ? src : defaultImage
    }

    // ============================================================
    // 📥 Charger le panier (DB uniquement, guestCart est auto-hydraté)
    // ============================================================
    async function loadCart() {
      if (auth.user?.id) {
        await loadCartFromSupabase()
        setupRealtime()
      }
      // Pour le mode invité, guestCart est déjà hydraté par pinia-persist
      // et items est un computed qui le lit directement
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

        // Cast explicite pour éviter l'erreur "Type instantiation is excessively deep"
        dbCart.value = ((data ?? []) as unknown as SimpleCartItem[]).map((i) => {
          i.product_image = safeImage(i.product_image)
          return i
        })
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
        const existing = dbCart.value.find((i) => i.product_id === product.id)
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
            product_purity: product.purity,
            product_sale_price: product.sale_price,
            is_on_sale: product.is_on_sale,
            product_image: safeImage(product.image),
            product_stock: product.stock,
            quantity: 1,
            updated_at: new Date().toISOString(),
            name_i18n: product.name_i18n,
            category_i18n: product.category_i18n,
          })
        }
        // Pas besoin de synchro, items est un computed de guestCart
      }

      // Tracker l'ajout au panier pour les analytics
      trackAddToCart()
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
      }
    }

    async function clearCart() {
      if (auth.user?.id) {
        await supabase.from('user_cart_items').delete().eq('user_id', auth.user.id)
        await loadCartFromSupabase()
      } else {
        guestCart.value = []
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
    // 👀 Watch Auth State (login/logout)
    // ============================================================
    // Note: On utilise un watch simple car items est un computed
    // qui switch automatiquement entre dbCart et guestCart
    let isFirstAuthChange = true
    auth.$subscribe(async () => {
      // Ignorer le premier appel (initialisation)
      if (isFirstAuthChange) {
        isFirstAuthChange = false
        return
      }

      if (auth.user?.id) {
        // Connexion : Fusionner le panier local vers la DB
        await mergeGuestCart()
        await loadCartFromSupabase()
        setupRealtime()
      } else {
        // Déconnexion : cleanup realtime, guestCart reste intact
        cleanupRealtime()
        dbCart.value = []
      }
    })

    // ============================================================
    // 🧮 Computed
    // ============================================================
    const totalItems = computed((): number => items.value.reduce((sum, i) => sum + Number(i.quantity ?? 0), 0))
    
    const totalPrice = computed((): number =>
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
      key: 'fp-cart-storage',
      storage: localStorage,
      // ⚠️ IMPORTANT : On ne persiste QUE 'guestCart'.
      // 'items' est recalculé à chaque chargement (soit depuis DB, soit depuis guestCart).
      pick: ['guestCart'],
    },
  },
)