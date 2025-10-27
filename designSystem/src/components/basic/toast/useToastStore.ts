import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'danger' | 'warning' | 'info'

export interface Toast {
  id: number
  title?: string
  message: string
  type: ToastType
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let idCounter = 0

  /** ✅ Nouvelle signature flexible */
  function show(
    payload: string | { message: string; title?: string; type?: ToastType; duration?: number },
    type: ToastType = 'info',
    duration = 2000,
  ) {
    const id = ++idCounter
    let toast: Toast

    if (typeof payload === 'string') {
      toast = { id, message: payload, type, duration }
    } else {
      toast = {
        id,
        title: payload.title,
        message: payload.message,
        type: payload.type ?? 'info',
        duration: payload.duration ?? 2000,
      }
    }

    toasts.value.push(toast)
    setTimeout(() => removeToast(id), toast.duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clearAll() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    removeToast,
    clearAll,
  }
})
