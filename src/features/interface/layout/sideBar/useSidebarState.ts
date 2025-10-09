import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStateStore } from '@/features/application'
import { useFavorisStore } from '@/features/interface/favoris/favorisStore'
import { useDialog } from '@/features/interface/dialog'
import { typeContextCourantToContextAppType, TypesContextesAutorisesEnum } from '@/features/auth/context-app'
import { getCurrentBreakpoint } from '@designSystem/fondation/breakpoints/getCurrentBreakpoint'
import { useHandleClickOutside } from '../../composables'

export function useSidebarState(sidebarRef: any) {
  const router = useRouter()
  const storeFavoris = useFavorisStore()
  const dialog = useDialog()
  const appState = useAppStateStore()

  const isSidebarReduced = ref(false)
  const isReducedManually = ref(false)

  const currentBreakpoint = ref(getCurrentBreakpoint())
  const isNotDesktop = computed(() => ['tablet', 'mobile'].includes(currentBreakpoint.value))

  const updateSidebarState = () => {
    if (!isReducedManually.value) {
      isSidebarReduced.value = isNotDesktop.value
    }
  }

  const handleResize = () => {
    currentBreakpoint.value = getCurrentBreakpoint()
    updateSidebarState()
  }

  const toggleSidebar = () => {
    isSidebarReduced.value = !isSidebarReduced.value
    isReducedManually.value = isSidebarReduced.value
  }

  const closeSidebarTablet = () => {
    if (isNotDesktop.value) {
      isSidebarReduced.value = true
      isReducedManually.value = isSidebarReduced.value
    }
  }

  const deleteFavorite = async (key: string) => {
    const result = await dialog.showDialog({
      message: 'Confirmez-vous la suppression du favori ?',
      type: 'YesNo',
      title: 'Supprimer un favori',
    })
    if (result === 'Yes') {
      storeFavoris.deleteFavori(key)
    }
  }

  const sidebarItems = computed(() => {
    const context =
      appState.contextCourant !== TypesContextesAutorisesEnum.Aucun
        ? typeContextCourantToContextAppType(appState.contextCourant)
        : null

    return router
      .getRoutes()
      .filter((route) => {
        if (!route.meta.label || !route.meta.icon) return false

        // Gestion de la visibility
        let visibility = route.meta.visibility
        if (typeof visibility === 'function') {
          visibility = visibility(route) // on passe la route pour que le resolver ait un contexte
        }

        return visibility !== 'hidden'
      })
      .sort((a, b) => (a.meta.order ?? 0) - (b.meta.order ?? 0))
      .map((route) => {
        if (route.meta.requiresContext && context) {
          return {
            ...route,
            params: { context },
          }
        }
        return route
      })
  })

  const onClickOutside = () => {
    closeSidebarTablet()
  }

  useHandleClickOutside(sidebarRef, onClickOutside)

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    updateSidebarState()
  })

  // watch(() => appState.contextCourant, {
  //   immediate: true,
  // })

  return {
    isSidebarReduced,
    toggleSidebar,
    sidebarItems,
    deleteFavorite,
    storeFavoris,
  }
}
