import type { Product } from '@/features/catalogue/composables/useProducts'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const lastAddedItem = ref<CartItem | null>(null)

  /** ➕ Ajoute un produit au panier */
  function addToCart(product: Product | CartItem) {
    // 🧠 Si le produit n'a pas encore de quantité, on en ajoute une par défaut
    const item: CartItem =
      'quantity' in product
        ? product
        : {
            ...product,
            quantity: 1,
            image: product.image || '/default-product-image.jpg',
          }

    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push(item)
    }

    // 🪄 On garde en mémoire le dernier ajouté pour un éventuel toast
    lastAddedItem.value = { ...item, key: Date.now() } as CartItem
  }

  /** ❌ Supprime un produit du panier */
  function removeFromCart(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  /** 🔄 Met à jour la quantité */
  function updateQuantity(id: string, qty: number) {
    const item = items.value.find((i) => i.id === id)
    if (item && qty > 0) item.quantity = qty
  }

  /** 🧹 Vide le panier */
  function clearCart() {
    items.value = []
  }

  /** Totaux */
  const totalItems = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

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
})
