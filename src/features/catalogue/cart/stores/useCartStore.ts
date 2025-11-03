import defaultImage from '@/assets/products/default/default-product-image.png'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Json } from '@/supabase/types/supabase'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { defineStore } from 'pinia'
import { computed, onUnmounted, ref, watch } from 'vue'
import type { CartItem } from '../../types/cart'
import type { Product } from '../../types/product'

// ============================================================
// 🛒 Store principal
// ============================================================

export const useCartStore = defineStore(
  'cart',
  () => {
    const auth = useAuthStore()

    // 💾 État local
    const items = ref<CartItem[]>([])
    const lastAddedItem = ref<CartItem | null>(null)
    const isSyncing = ref(false)
    let channel: RealtimeChannel | null = null

    // ============================================================
    // 🧰 Helpers
    // ============================================================

    function safeImage(src: string | null | undefined): string {
      return src && src.trim() !== '' ? src : defaultImage
    }

    function normalizeItem(raw: any): CartItem {
      return {
        ...raw,
        price: Number(raw.price) || 0,
        quantity: Number(raw.quantity) || 1,
        image: safeImage(raw.image),
      }
    }

    function mergeCarts(local: CartItem[], remote: CartItem[]): CartItem[] {
      const merged = new Map<string, CartItem>()
      for (const item of local) merged.set(item.id, normalizeItem(item))
      for (const item of remote) {
        const existing = merged.get(item.id)
        if (existing) existing.quantity += item.quantity
        else merged.set(item.id, normalizeItem(item))
      }
      return Array.from(merged.values())
    }

    // ============================================================
    // 🛍️ Actions locales
    // ============================================================

    function addToCart(product: Product | CartItem) {
      const item: CartItem =
        'quantity' in product ? normalizeItem(product) : normalizeItem({ ...product, quantity: 1 })

      const existing = items.value.find((i) => i.id === item.id)
      if (existing) existing.quantity += 1
      else items.value.push(item)

      lastAddedItem.value = { ...item, key: Date.now() } as CartItem
      if (auth.user) syncCartWithSupabase()
    }

    function removeFromCart(id: string) {
      items.value = items.value.filter((i) => i.id !== id)
      if (auth.user) syncCartWithSupabase()
    }

    function updateQuantity(id: string, qty: number) {
      const item = items.value.find((i) => i.id === id)
      if (item && qty > 0) item.quantity = qty
      if (auth.user) syncCartWithSupabase()
    }

    function clearCart() {
      items.value = []
      if (auth.user) syncCartWithSupabase()
    }

    // ============================================================
    // ☁️ Supabase Sync (upload + download)
    // ============================================================
    async function syncCartWithSupabase() {
      const userId = auth.user?.id
      if (!userId) return

      try {
        isSyncing.value = true

        const payload = {
          user_id: userId, // ✅ string explicite
          items: items.value as unknown as Json, // ✅ cast en Json (Supabase attend ça)
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase.from('user_cart').upsert(payload) // ✅ plus d'erreur TS

        if (error) console.warn('Erreur sync Supabase', error)
      } finally {
        isSyncing.value = false
      }
    }

    async function loadCartFromSupabase() {
      const userId = auth.user?.id
      if (!userId) return

      const { data, error } = await supabase
        .from('user_cart')
        .select('items')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.warn('Erreur chargement panier Supabase', error)
        return
      }

      // 🧠 Corrige ici : toujours normaliser les JSON du panier
      const remoteItemsRaw = (data?.items as any[]) ?? []
      const remoteItems = remoteItemsRaw.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || defaultImage,
      })) as CartItem[]

      items.value = mergeCarts(items.value, remoteItems)
    }

    // ============================================================
    // ⚡ Realtime Sync
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
            table: 'user_cart',
            filter: `user_id=eq.${auth.user.id}`,
          },
          async (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const newItems = (payload.new.items as CartItem[]) ?? []
              items.value = mergeCarts(items.value, newItems)
            }
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

    onUnmounted(cleanupRealtime)

    // ============================================================
    // 👀 Watch utilisateur
    // ============================================================

    watch(
      () => auth.user,
      async (user) => {
        if (user) {
          await loadCartFromSupabase()
          await syncCartWithSupabase()
          setupRealtime()
        } else {
          cleanupRealtime()
        }
      },
      { immediate: true },
    )

    // ============================================================
    // 🧮 Computed
    // ============================================================

    const totalItems = computed(() =>
      items.value.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
    )

    const totalPrice = computed(() =>
      items.value.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 0), 0),
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
      lastAddedItem,
      syncCartWithSupabase,
      loadCartFromSupabase,
    }
  },
  {
    persist: {
      key: 'fastpeptides-cart',
      storage: localStorage,
      pick: ['items'],
    },
  },
)
