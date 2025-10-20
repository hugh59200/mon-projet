import { useAuthStore } from '@/features/auth/useAuthStore'
import router from '@/router'
import type { IconName } from '@designSystem/fondation/icons/iconsList'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // état sidebar
  const isReduced = ref(false)

  const toggle = () => (isReduced.value = !isReduced.value)

  // récupération de l’auth
  const auth = useAuthStore()

  // génération dynamique des items
  const sidebarItems = computed(() => {
    return router
      .getRoutes()
      .filter((route) => {
        if (!route.meta.label || !route.meta.icon) return false

        // accessibilité
        if (route.meta.requiresAuth && !auth.isAuthenticated) return false
        if (route.meta.requiresAdmin && !auth.isAdmin) return false

        // visibilité personnalisée
        if (route.meta.visibility) {
          if (typeof route.meta.visibility === 'function') {
            return route.meta.visibility(route) === 'visible'
          }
          return route.meta.visibility === 'visible'
        }

        return true
      })
      .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
      .map((route) => ({
        name: route.name!,
        path: route.path,
        label: route.meta.label as string,
        icon: route.meta.icon as IconName,
      }))
  })

  return {
    isReduced,
    toggle,
    sidebarItems,
  }
})
