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
        tabKey: child.name as TabProps['tabKey'],
      }))
  })

  const tabs = computed(() => {
    if (!tabsTitle) return tabsRoutes.value

    if (tabsTitle.length !== tabsRoutes.value.length) return tabsRoutes.value

    return tabsTitle.map((tabKey) => {
      return {
        tabKey,
      }
    })
  })

  const getTabsRoute = (name: RouteName) => {
    return tabsRoutes.value.at(tabs.value.findIndex((t) => t.tabKey === name))!.tabKey as string
  }

  const getTabsTitle = (name: RouteName) => {
    return tabs.value.at(tabsRoutes.value.findIndex((t) => t.tabKey === name))!.tabKey as string
  }

  const goToTab = (name: RouteName) => {
    const routeName = getTabsRoute(name)

    router.push({
      name: routeName,
    })
  }

  return { tabs, goToTab, getTabsTitle }
}
