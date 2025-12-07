import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchUserOrders } from '@/api/supabase/orders'
import type { OrdersFullView, OrderItemDetailed } from '@/supabase/types/supabase.types'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export interface LotHistory {
  id: string
  productId: string
  productName: string
  productImage: string | null
  productSlug: string | null
  batchNumber: string
  orderDate: string
  orderId: string
  quantity: number
}

export const useOrderHistoryStore = defineStore('orderHistory', () => {
  const auth = useAuthStore()
  const orders = ref<OrdersFullView[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  /**
   * Extrait tous les lots distincts des commandes passées
   */
  const previousLots = computed<LotHistory[]>(() => {
    const lotsMap = new Map<string, LotHistory>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const order of orders.value as any[]) {
      const items = (order.detailed_items || []) as OrderItemDetailed[]

      for (const item of items) {
        // Utilise le batch_number du produit si disponible
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const batchNumber = (item as any).batch_number || (item as any).product_batch_number
        if (!batchNumber) continue

        const key = `${item.product_id}-${batchNumber}`

        // Ne garder que la première occurrence (commande la plus récente)
        if (!lotsMap.has(key)) {
          lotsMap.set(key, {
            id: key,
            productId: item.product_id,
            productName: item.product_name || 'Produit',
            productImage: item.product_image || null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            productSlug: (item as any).product_slug || null,
            batchNumber,
            orderDate: order.created_at || '',
            orderId: order.order_id || '',
            quantity: item.quantity || 1,
          })
        }
      }
    }

    return Array.from(lotsMap.values()).sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )
  })

  /**
   * Vérifie si un produit a déjà été commandé
   */
  function hasOrderedProduct(productId: string | undefined): boolean {
    if (!productId) return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return orders.value.some((o: any) => {
      const items = (o.detailed_items || []) as OrderItemDetailed[]
      return items.some((i) => i.product_id === productId)
    })
  }

  /**
   * Vérifie si un lot spécifique a déjà été commandé
   */
  function hasOrderedLot(productId: string, batchNumber: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return orders.value.some((o: any) => {
      const items = (o.detailed_items || []) as OrderItemDetailed[]
      return items.some((i) => {
        const itemBatch = (i as any).batch_number || (i as any).product_batch_number
        return i.product_id === productId && itemBatch === batchNumber
      })
    })
  }

  /**
   * Récupère la date de la dernière commande pour un produit
   */
  function getLastOrderDateForProduct(productId: string | undefined): string | null {
    if (!productId) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const order of orders.value as any[]) {
      const items = (order.detailed_items || []) as OrderItemDetailed[]
      if (items.some((i) => i.product_id === productId)) {
        return order.created_at || null
      }
    }
    return null
  }

  /**
   * Récupère le dernier lot commandé pour un produit
   */
  function getLastOrderedLot(productId: string | undefined): string | null {
    if (!productId) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const order of orders.value as any[]) {
      const items = (order.detailed_items || []) as OrderItemDetailed[]
      for (const item of items) {
        if (item.product_id === productId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (item as any).batch_number || (item as any).product_batch_number || null
        }
      }
    }
    return null
  }

  /**
   * Charge les commandes de l'utilisateur connecté
   */
  async function loadOrders(): Promise<void> {
    if (!auth.user?.id || loaded.value) return

    loading.value = true
    try {
      orders.value = await fetchUserOrders(auth.user.id)
      loaded.value = true
    } catch (error) {
      console.error('Erreur chargement historique commandes:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Force le rechargement des commandes
   */
  async function refreshOrders(): Promise<void> {
    loaded.value = false
    await loadOrders()
  }

  /**
   * Reset le store (déconnexion)
   */
  function reset(): void {
    orders.value = []
    loaded.value = false
    loading.value = false
  }

  return {
    // State
    orders,
    loading,
    loaded,

    // Getters
    previousLots,

    // Actions
    hasOrderedProduct,
    hasOrderedLot,
    getLastOrderDateForProduct,
    getLastOrderedLot,
    loadOrders,
    refreshOrders,
    reset,
  }
})
