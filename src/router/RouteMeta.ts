import type { IconName } from '@designSystem/fondation/icons/iconsList'
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
    icon?: IconName
    order?: number
    title?: string
    description?: string
    getTitle?: (route: RouteLocationNormalizedLoaded) => string
    getDescription?: (route: RouteLocationNormalizedLoaded) => string
  }
}
