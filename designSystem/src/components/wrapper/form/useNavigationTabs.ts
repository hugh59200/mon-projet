import type { RouteName } from '@/router/route-name'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useNavigationTabs() {
  const router = useRouter()
  const route = useRoute()

  const tabsRoutes = computed<TabProps[]>(() => {
    const parent = route.matched[0]
    if (!parent?.children) return []

    return parent.children.map((child) => ({
      routeName: child.name as RouteName,
      tabKey: (child.meta?.label as TabsModel) || (child.name as string),
      tabState: (child.meta?.icon as IconNameNext) ?? undefined,
      color: (child.meta?.color as string) ?? '#9CA3AF', // 🔹 couleur par défaut (gris)
    }))
  })

  const tabs = computed(() => tabsRoutes.value)

  const goToTab = (name: RouteName) => {
    const target = tabsRoutes.value.find((t) => t.routeName === name)
    if (target) router.push({ name: target.routeName })
  }

  return { tabs, goToTab }
}
