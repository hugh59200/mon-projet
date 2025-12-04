// src/features/admin/stores/useAdminTabsSync.ts
import { useTabsIndicatorStore } from '@designSystem/components/basic/tabs/useTabsIndicatorStore'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function useAdminTabsSync() {
  const route = useRoute()
  const indicatorStore = useTabsIndicatorStore()

  watch(
    () => route.name,
    (newRoute) => {
      if (!newRoute) return
      const saved = indicatorStore.getIndicator(newRoute.toString())
      indicatorStore.setIndicator(saved.left, saved.width, saved.color, newRoute.toString())
    },
    { immediate: true },
  )
}
