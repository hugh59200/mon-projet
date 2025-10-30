import { useAuthStore } from '@/features/auth/useAuthStore'
import router from '@/router'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isReduced = ref(false)
  const toggle = () => (isReduced.value = !isReduced.value)
  const auth = useAuthStore()

  const allowedSidebarNames = ['home', 'catalogue', 'actualites', 'faq']

  const sidebarItems = computed(() => {
    return router
      .getRoutes()
      .filter((route) => {
        if (!allowedSidebarNames.includes(route.name as string)) return false
        if (!route.meta.label || !route.meta.icon) return false
        if (route.meta.requiresAuth && !auth.isAuthenticated) return false
        if (route.meta.requiresAdmin && !auth.isAdmin) return false
        return true
      })
      .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
      .map((route) => ({
        name: route.name!,
        path: route.path,
        label: route.meta.label as string,
        icon: route.meta.icon as IconNameNext,
      }))
  })

  return { isReduced, toggle, sidebarItems }
})
