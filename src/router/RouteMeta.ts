import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
  RouteRecordNormalized,
} from 'vue-router'

export type RouteLabelResolver = (
  route: RouteLocationNormalizedLoadedGeneric,
) => string | [string, string]

export type Visibility = 'hidden' | 'visible' | 'disabled'

export type VisibilityResolver = (route: RouteRecordNormalized) => Visibility

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresCart?: boolean
    requiresAdmin?: boolean
    label?: string
    labelKey?: string
    icon?: IconNameNext
    order?: number
    title?: string
    titleKey?: string
    heading?: string
    headingKey?: string
    description?: string
    descriptionKey?: string
    badge?: string
    badgeKey?: string
    headerIcon?: IconNameNext
    getTitle?: (route: RouteLocationNormalizedLoaded) => string
    getDescription?: (route: RouteLocationNormalizedLoaded) => string
  }
}
