import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore' // ✅ import du store
import type { RouteName } from '@/router/route-name'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useNavigationTabs() {
  const router = useRouter()
  const route = useRoute()
  const adminTabStore = useAdminTabStore()

  // 🔹 Récupère tous les onglets enfants du parent courant (ex: /admin)
  const tabsRoutes = computed<TabProps[]>(() => {
    const parent = route.matched[0]
    if (!parent?.children) return []

    return parent.children.map((child) => ({
      routeName: child.name as RouteName,
      tabKey: (child.meta?.label as TabsModel) || (child.name as string),
      tabState: (child.meta?.icon as IconNameNext) ?? undefined,
      color: (child.meta?.color as string) ?? '#9CA3AF', // couleur par défaut
    }))
  })

  const tabs = computed(() => tabsRoutes.value)

  // 🔁 Synchronisation route ↔ store (mise à jour à chaque navigation)
  watch(
    () => route.name,
    (newName) => {
      if (newName?.toString().startsWith('Admin')) {
        adminTabStore.setLastTab(newName.toString())
      }
    },
    { immediate: true },
  )

  // 🚀 Fonction de navigation + mise à jour store
  const goToTab = (name: RouteName) => {
    const target = tabsRoutes.value.find((t) => t.routeName === name)
    if (target) {
      adminTabStore.setLastTab(name.toString()) // ✅ persisté
      router.push({ name: target.routeName })
    }
  }

  return { tabs, goToTab }
}
