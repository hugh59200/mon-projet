import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock: boolean
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // ✅ Charger depuis localStorage
  const stored = localStorage.getItem('cart')
  if (stored) {
    items.value = JSON.parse(stored)
  }

  // 💾 Persistance automatique
  watch(items, (val) => localStorage.setItem('cart', JSON.stringify(val)), { deep: true })

  // ➕ Ajouter un produit
  function addToCart(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) existing.quantity++
    else items.value.push({ ...product, quantity: 1 })
  }

  // ➖ Retirer un produit
  function removeFromCart(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  // 🔄 Modifier quantité
  function updateQuantity(id: string, qty: number) {
    const item = items.value.find((i) => i.id === id)
    if (item && qty > 0) item.quantity = qty
  }

  // 🧮 Calculs
  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
  }
})
