import { defineStore } from 'pinia'
import { ref, type Component } from 'vue'

/** Types de toast disponibles */
export type ToastType = 'success' | 'danger' | 'warning' | 'info'

/** Structure d’un toast */
export interface Toast {
  id: number
  title?: string
  message?: string
  type: ToastType
  duration?: number
  /** 🧩 Composant personnalisé optionnel */
  component?: Component
  /** Props du composant custom */
  props?: Record<string, any>
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let idCounter = 0

  /**
   * ✅ Signature flexible
   * show('Message', 'success')
   * show({ message: 'Hello', title: 'Info', type: 'info' })
   * show({ component: CustomToast, props: { foo: 1 } })
   */
  function show(
    payload:
      | string
      | {
          title?: string
          message?: string
          type?: ToastType
          duration?: number
          component?: Component
          props?: Record<string, any>
        },
    type: ToastType = 'info',
    duration = 2000,
  ) {
    const id = ++idCounter
    let toast: Toast

    // 🧱 Cas simple : message texte
    if (typeof payload === 'string') {
      toast = { id, message: payload, type, duration }
    } else {
      toast = {
        id,
        title: payload.title,
        message: payload.message,
        type: payload.type ?? type,
        duration: payload.duration ?? duration,
        component: payload.component,
        props: payload.props,
      }
    }

    toasts.value.push(toast)
    setTimeout(() => removeToast(id), toast.duration)
  }

  /** 🧹 Supprimer un toast */
  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  /** 💥 Tout effacer */
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
