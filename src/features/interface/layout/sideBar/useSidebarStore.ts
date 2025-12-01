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

  const sidebarItems = computed(() => {
    return router
      .getRoutes()
      .filter((route) => {
        if (!allowedSidebarNames.includes(route.name as string)) return false
        if (!route.meta.labelKey || !route.meta.icon) return false
        if (route.meta.requiresAuth && !auth.isAuthenticated) return false
        if (route.meta.requiresAdmin && !auth.isAdmin) return false
        return true
      })
      .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
      .map((route) => {
        return {
          name: route.name!,
          path: route.path,
          label: route.meta.labelKey ? t(route.meta.labelKey) : '',
          icon: route.meta.icon as IconNameNext,
        }
      })
  })

  return { isReduced, toggle, sidebarItems }
})
