import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'danger' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let idCounter = 0

  function showToast(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++idCounter
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    // Auto-suppression après durée
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clearAll() {
    toasts.value = []
  }

  return {
    toasts,
    showToast,
    removeToast,
    clearAll,
  }
})
