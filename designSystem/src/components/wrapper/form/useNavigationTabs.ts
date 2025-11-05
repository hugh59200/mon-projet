import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
import type { RouteName } from '@/router/route-name'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
import type { TextColor } from '@designSystem/components/basic/text'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useNavigationTabs() {
  const router = useRouter()
  const route = useRoute()
  const adminTabStore = useAdminTabStore()

  // 🔹 Récupère les routes enfants du parent (ex: /admin)
  const tabsRoutes = computed<TabProps[]>(() => {
    const parent = route.matched[0]
    if (!parent?.children) return []

    return parent.children.map((child) => ({
      routeName: child.name as RouteName,
      tabKey: (child.meta?.label as TabsModel) || (child.name as string),
      color: (child.meta?.color as TextColor) ?? 'neutral-300',
      icon: child.meta?.icon as IconNameNext,
    }))
  })

  // ✅ Liste finale typée : TabProps[]
  const tabs = computed<TabProps[]>(() =>
    tabsRoutes.value.map((t) => ({
      routeName: t.routeName,
      tabKey: t.tabKey,
      icon: t.icon,
      color: t.color,
    })),
  )

  // 🚀 Navigation + stockage de l’onglet actif
  const goToTab = (name: RouteName) => {
    const target = tabsRoutes.value.find((t) => t.routeName === name)
    if (target) {
      adminTabStore.setLastTab(name.toString())
      router.push({ name: target.routeName })
    }
  }

  return { tabs, goToTab }
}
