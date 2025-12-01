import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import router from '@/router'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useSidebarStore = defineStore('sidebar', () => {
  const { t } = useI18n()
  const isReduced = ref(false)
  const toggle = () => (isReduced.value = !isReduced.value)
  const auth = useAuthStore()

  const allowedSidebarNames = ['home', 'catalogue', 'reconstitution', 'actualites', 'faq']

  // Map route names to i18n keys
  const labelKeys: Record<string, string> = {
    home: 'nav.home',
    catalogue: 'nav.catalogue',
    reconstitution: 'reconstitution.title',
    actualites: 'nav.news',
    faq: 'nav.faq',
  }

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
      .map((route) => {
        const routeName = route.name as string
        const labelKey = labelKeys[routeName]
        return {
          name: route.name!,
          path: route.path,
          label: labelKey ? t(labelKey) : (route.meta.label as string),
          icon: route.meta.icon as IconNameNext,
        }
      })
  })

  return { isReduced, toggle, sidebarItems }
})
