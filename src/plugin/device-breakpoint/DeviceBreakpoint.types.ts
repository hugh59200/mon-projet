// src/plugin/device-breakpoint.ts
import { getCurrentInstance, inject, readonly, ref, type App, type Ref } from 'vue'

export const Breakpoint = ['mobile', 'tablet', 'desktop'] as const
export type Breakpoint = (typeof Breakpoint)[number]

// ⚠️ Ces valeurs doivent correspondre à designSystem/src/fondation/breakpoints/breakpoints.less
export const MOBILE_MAX = 720 as const // @breakpoint-mobile
export const TABLET_MAX = 1160 as const // @breakpoint-tablet
export const DESKTOP_MIN = 1400 as const // @breakpoint-desktop

export type DeviceBreakpointData = {
  currentWindowsWidth: Ref<number>
  currentWindowsHeight: Ref<number>
  isMobile: Ref<boolean>
  isTablet: Ref<boolean>
  isDesktop: Ref<boolean>
  currentBreakpoint: Ref<Breakpoint>
}

export const DEVICE_BREAKPOINT = Symbol('DEVICE_BREAKPOINT')

export type DeviceBreakpointOptions = {
  mobileMax?: number
  tabletMax?: number
}

/**
 * 💫 Plugin global : fournit les breakpoints réactifs
 */
export function deviceBreakpointPlugin(app: App, options: DeviceBreakpointOptions = {}) {
  const mobileMax = options.mobileMax ?? MOBILE_MAX
  const tabletMax = options.tabletMax ?? TABLET_MAX

  const currentWindowsWidth = ref(window.innerWidth)
  const currentWindowsHeight = ref(window.innerHeight)
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const currentBreakpoint = ref<Breakpoint>('desktop')

  const update = () => {
    const w = window.innerWidth
    currentWindowsWidth.value = w
    currentWindowsHeight.value = window.innerHeight
    isMobile.value = w <= mobileMax
    isTablet.value = w > mobileMax && w <= tabletMax
    isDesktop.value = w > tabletMax
    currentBreakpoint.value = isMobile.value ? 'mobile' : isTablet.value ? 'tablet' : 'desktop'
  }

  window.addEventListener('resize', update)
  update()

  const data: DeviceBreakpointData = {
    currentWindowsWidth: readonly(currentWindowsWidth),
    currentWindowsHeight: readonly(currentWindowsHeight),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    currentBreakpoint: readonly(currentBreakpoint),
  }

  app.provide(DEVICE_BREAKPOINT, data)
}

/**
 * ✅ Hook sûr : fonctionne dans setup() ou hors composant (directive, service)
 */
export function useDeviceBreakpoint(): DeviceBreakpointData {
  const instance = getCurrentInstance()

  // 💡 on ne fait inject() que si on est dans un setup()
  if (instance) {
    const injected = inject(DEVICE_BREAKPOINT, null)
    if (injected) return injected
  }

  // 🩹 fallback "standalone" : utilisé dans directives, ou hors contexte Vue
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const isMobile = ref(width.value <= MOBILE_MAX)
  const isTablet = ref(width.value > MOBILE_MAX && width.value <= TABLET_MAX)
  const isDesktop = ref(width.value > TABLET_MAX)
  const currentBreakpoint = ref<Breakpoint>(
    isMobile.value ? 'mobile' : isTablet.value ? 'tablet' : 'desktop',
  )

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    isMobile.value = width.value <= MOBILE_MAX
    isTablet.value = width.value > MOBILE_MAX && width.value <= TABLET_MAX
    isDesktop.value = width.value > TABLET_MAX
    currentBreakpoint.value = isMobile.value ? 'mobile' : isTablet.value ? 'tablet' : 'desktop'
  }

  window.addEventListener('resize', update)
  update()

  return {
    currentWindowsWidth: width,
    currentWindowsHeight: height,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
  }
}
