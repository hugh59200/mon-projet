// ============================================================
// 🛒 useCartStore — version 2025 V2.0 (Promo Aware)
// ============================================================
import defaultImage from '@/assets/products/default/default-product-image.png'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import type { CartItems, CartView, Products } from '@/supabase/types/supabase.types'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const auth = useAuthStore()

  // ============================================================
  // 💾 État
  // ============================================================
  const items = ref<CartView[]>([])
  const isSyncing = ref(false)
  let channel: RealtimeChannel | null = null

  // ============================================================
  // 🧰 Helpers
  // ============================================================
  function safeImage(src?: string | null) {
    return src && src.trim() !== '' ? src : defaultImage
  }

  // ============================================================
  // 📥 Charger le panier complet
  // ============================================================
  async function loadCartFromSupabase() {
    if (isSyncing.value) return
    const userId = auth.user?.id
    if (!userId) return

    isSyncing.value = true
    try {
      const { data, error } = await supabase
        .from('user_cart_view')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.warn('Erreur chargement panier', error)
        return
      }

      items.value = (data ?? []).map((i) => ({
        ...i,
        product_image: safeImage(i.product_image),
      }))
    } finally {
      isSyncing.value = false
    }
  }

  // ============================================================
  // 📤 Synchronisation (insert / update / delete)
  // ============================================================
  async function addToCart(product: Products) {
    const userId = auth.user?.id
    if (!userId) return

    const existing = items.value.find((i) => i.product_id === product.id)
    if (existing) {
      await updateQuantity(product.id, (existing.quantity ?? 0) + 1)
      return
    }

    const payload: Omit<CartItems, 'id' | 'updated_at'> = {
      user_id: userId,
      product_id: product.id,
      quantity: 1,
    }

    const { error } = await supabase.from('user_cart_items').insert(payload)
    if (error) console.warn('Erreur addToCart', error)
    await loadCartFromSupabase()
  }

  async function updateQuantity(productId: string, quantity: number) {
    const userId = auth.user?.id
    if (!userId) return

    if (quantity <= 0) return removeFromCart(productId)

    const { error } = await supabase
      .from('user_cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) console.warn('Erreur updateQuantity', error)
    await loadCartFromSupabase()
  }

  async function removeFromCart(productId: string) {
    const userId = auth.user?.id
    if (!userId) return

    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) console.warn('Erreur removeFromCart', error)
    await loadCartFromSupabase()
  }

  async function clearCart() {
    const userId = auth.user?.id
    if (!userId) return

    const { error } = await supabase.from('user_cart_items').delete().eq('user_id', userId)
    if (error) console.warn('Erreur clearCart', error)
    items.value = []
  }

  // ============================================================
  // ⚡ Realtime (mise à jour live)
  // ============================================================
  function setupRealtime() {
    if (!auth.user?.id) return
    cleanupRealtime()

    channel = supabase
      .channel(`cart:${auth.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_cart_items',
          filter: `user_id=eq.${auth.user.id}`,
        },
        async () => {
          await loadCartFromSupabase()
        },
      )
      .subscribe()
  }

  function cleanupRealtime() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  // ============================================================
  // 👀 Watch utilisateur
  // ============================================================
  watch(
    () => auth.user,
    async (user, oldUser) => {
      if (user) {
        await loadCartFromSupabase()
        setupRealtime()
      } else if (oldUser) {
        cleanupRealtime()
        items.value = []
      }
    },
    { immediate: true },
  )

  // ============================================================
  // 🧮 Computed (V2.0 - Gestion Prix Promo)
  // ============================================================
  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + Number(i.quantity ?? 0), 0),
  )

  // ✅ CORRECTION : Utilisation du prix soldé si applicable
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const qty = Number(item.quantity ?? 0)

      // Logique V2 : Si en solde, on prend sale_price, sinon price
      const unitPrice = item.is_on_sale
        ? Number(item.product_sale_price ?? item.product_price ?? 0)
        : Number(item.product_price ?? 0)

      return sum + unitPrice * qty
    }, 0),
  )

  // ============================================================
  // ✅ Export
  // ============================================================
  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromSupabase,
  }
})
