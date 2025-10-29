import type { InjectionKey, Ref } from 'vue'

export const Breakpoint = ['mobile', 'tablet', 'desktop'] as const
export type Breakpoint = (typeof Breakpoint)[number]

export const MOBILE_MAX = 1000 as const
export const TABLET_MAX = 1400 as const

type DeviceBreakpointData = {
  currentWindowsWidth: Ref<number>
  currentWindowsHeight: Ref<number>
  isMobile: Ref<boolean>
  isTablet: Ref<boolean>
  isDesktop: Ref<boolean>
  currentBreakpoint: Ref<Breakpoint>
}

export const DEVICE_BREAKPOINT: InjectionKey<DeviceBreakpointData> = Symbol('DEVICE_BREAKPOINT')

export type DeviceBreakpointOptions = {
  mobileMax: number
  tabletMax: number
}
