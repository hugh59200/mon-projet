import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem } from './Cart.types'

export const useCartStore = defineStore(
  'cartItem', // ✅ nom unique et plus explicite
  () => {
    const items = ref<CartItem[]>([])
    const lastAddedItem = ref<CartItem | null>(null) // 🆕 pour la popup “Ajouté au panier”

    /** ➕ Ajoute un produit au panier */
    function addToCart(product: CartItem) {
      const existing = items.value.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        items.value.push({ ...product, quantity: 1 })
      }

      // 🪄 Garde une référence éphémère pour la popup
      lastAddedItem.value = { ...product, key: Date.now() } as CartItem
    }

    /** ❌ Supprime un produit */
    function removeFromCart(id: string) {
      items.value = items.value.filter((i) => i.id !== id)
    }

    /** 🔄 Met à jour la quantité */
    function updateQuantity(id: string, qty: number) {
      const item = items.value.find((i) => i.id === id)
      if (item && qty > 0) item.quantity = qty
    }

    /** 🧹 Vide complètement le panier */
    function clearCart() {
      items.value = []
    }

    /** 🔢 Total d’articles */
    const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

    /** 💰 Montant total */
    const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

    return {
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      lastAddedItem,
    }
  },
  {
    persist: {
      key: 'fp:cart',
      storage: localStorage,
      pick: ['items'], // ✅ V4 utilise `pick`, pas `paths`
    },
  },
)
