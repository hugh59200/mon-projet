import { getCurrentBreakpoint } from '@designSystem/fondation/breakpoints/getCurrentBreakpoint'
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHandleClickOutside } from '../../composables/useHandleClickOutside'

export function useSidebarState(sidebarRef: Ref<HTMLElement | null>) {
  const router = useRouter()

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

  const sidebarItems = computed(() => {
    return router
      .getRoutes()
      .filter((route) => {
        if (!route.meta.label || !route.meta.icon) return false

        // Gestion de la visibility
        let visibility = route.meta.visibility
        if (typeof visibility === 'function') {
          visibility = visibility(route)
        }

        return visibility !== 'hidden'
      })
      .sort((a, b) => (Number(a.meta.order) || 0) - (Number(b.meta.order) || 0))
      .map((route) => {
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

  return {
    isSidebarReduced,
    toggleSidebar,
    sidebarItems,
  }
}
