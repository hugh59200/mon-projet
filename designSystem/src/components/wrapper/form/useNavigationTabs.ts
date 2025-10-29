import type { RouteName } from '@/router/route-name'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useNavigationTabs(tabsTitle?: string[]) {
  const router = useRouter()
  const route = useRoute()

  const getRouteByName = (name: RouteName) => router.getRoutes().find((r) => r.name === name)

  const isAccessible = (name: RouteName) => !getRouteByName(name)?.meta?.requiresAdmin

  const tabsRoutes = computed(() => {
    const parent = route.matched[0]
    if (!parent?.children) return []

    return parent.children
      .filter((child) => isAccessible(child.name as RouteName))
      .map((child) => ({
        routeName: child.name as RouteName,
        tabKey: (child.meta?.label as string) || (child.name as string),
        // tabState: child.meta?.icon as IconNameNext | undefined, // ✅ typage fort ici
      }))
  })

  const tabs = computed(() => {
    if (!tabsTitle) return tabsRoutes.value

    return tabsTitle.map((label) => {
      const found = tabsRoutes.value.find((t) => t.tabKey === label)
      return found ?? { tabKey: label, routeName: label as RouteName }
    })
  })

  const getTabsTitle = (name: RouteName) => {
    const match = tabsRoutes.value.find((t) => t.routeName === name)
    return match ? match.tabKey : name
  }

  const goToTab = (name: RouteName) => {
    const target = tabsRoutes.value.find((t) => t.tabKey === name || t.routeName === name)
    if (target) router.push({ name: target.routeName })
  }

  return { tabs, goToTab, getTabsTitle }
}
