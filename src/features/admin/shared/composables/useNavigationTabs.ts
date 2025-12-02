import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
import type { RouteName } from '@/router/route-name'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import type { TextColor } from '@designSystem/components/basic/text'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

interface TabProps {
  routeName: RouteName
  tabKey: string
  color?: TextColor
  icon?: IconNameNext
}

export function useNavigationTabs() {
  const router = useRouter()
  const route = useRoute()
  const adminTabStore = useAdminTabStore()
  const { t } = useI18n()

  // Récupère les routes enfants du parent (ex: /admin)
  const tabsRoutes = computed<TabProps[]>(() => {
    const parent = route.matched[0]
    if (!parent?.children) return []

    return parent.children.map((child) => ({
      routeName: child.name as RouteName,
      tabKey: child.meta?.labelKey ? t(child.meta.labelKey as string) : (child.name as string),
      color: (child.meta?.color as TextColor) ?? 'neutral-300',
      icon: child.meta?.icon as IconNameNext,
    }))
  })

  // Liste finale typée
  const tabs = computed<TabProps[]>(() =>
    tabsRoutes.value.map((t) => ({
      routeName: t.routeName,
      tabKey: t.tabKey,
      icon: t.icon,
      color: t.color,
    })),
  )

  // Navigation + stockage de l'onglet actif
  const goToTab = (name: RouteName) => {
    const target = tabsRoutes.value.find((t) => t.routeName === name)
    if (target) {
      adminTabStore.setLastTab(name.toString())
      router.push({ name: target.routeName })
    }
  }

  return { tabs, goToTab }
}
