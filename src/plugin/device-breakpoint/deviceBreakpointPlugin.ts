import { useDebounce } from '@/features/shared/tools'
import { computed, ref, watch, type App } from 'vue'
import {
  DEVICE_BREAKPOINT,
  MOBILE_MAX,
  TABLET_MAX,
  type Breakpoint,
  type DeviceBreakpointOptions,
} from './DeviceBreakpoint.types.ts'

export default {
  install(app: App<Element>, options?: Partial<DeviceBreakpointOptions>) {
    options ??= {}
    options.mobileMax ??= MOBILE_MAX
    options.tabletMax ??= TABLET_MAX

    const currentWindowsWidth = ref(document.body.clientWidth)
    const currentWindowsHeight = ref(window.innerHeight)

    const debounce = useDebounce(100)

    const handleResize = () => {
      debounce(() => {
        currentWindowsWidth.value = document.body.clientWidth
        currentWindowsHeight.value = window.innerHeight
      })
    }

    const isMobile = computed(() => currentBreakpoint.value === 'mobile')
    const isTablet = computed(() => currentBreakpoint.value === 'tablet')
    const isDesktop = computed(() => currentBreakpoint.value === 'desktop')

    const currentBreakpoint = computed<Breakpoint>(() => {
      if (currentWindowsWidth.value < options.mobileMax!) return 'mobile'
      if (
        currentWindowsWidth.value >= options.mobileMax! &&
        currentWindowsWidth.value < options.tabletMax!
      )
        return 'tablet'
      return 'desktop'
    })

    watch(
      currentBreakpoint,
      () => {
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop')
        document.body.classList.add(`device-${currentBreakpoint.value}`)
      },
      { immediate: true },
    )

    window.addEventListener('resize', handleResize)
    app.onUnmount(() => window.removeEventListener('resize', handleResize))

    app.provide(DEVICE_BREAKPOINT, {
      currentBreakpoint,
      currentWindowsHeight,
      currentWindowsWidth,
      isDesktop,
      isMobile,
      isTablet,
    })
  },
}
