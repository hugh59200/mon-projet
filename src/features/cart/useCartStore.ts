import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { CartItem } from './Cart.types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // ✅ Charger depuis localStorage
  const stored = localStorage.getItem('cart')
  if (stored) items.value = JSON.parse(stored)

  // 💾 Persistance automatique
  watch(items, (val) => localStorage.setItem('cart', JSON.stringify(val)), { deep: true })

  // ➕ Ajouter / ➖ Retirer / 🔄 Mettre à jour
  function addToCart(product: CartItem) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) existing.quantity++
    else items.value.push({ ...product, quantity: 1 })
  }

  function removeFromCart(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function updateQuantity(id: string, qty: number) {
    const item = items.value.find((i) => i.id === id)
    if (item && qty > 0) item.quantity = qty
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cart') // 🧹 optionnel : vide aussi le localStorage
  }

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  return { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }
})
