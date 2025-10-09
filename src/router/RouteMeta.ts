import type { IconName } from '@designSystem/fondation/icons/iconsList'
import type { RouteLocationNormalizedLoadedGeneric, RouteRecordNormalized } from 'vue-router'

export type RouteLabelResolver = (route: RouteLocationNormalizedLoadedGeneric) => string | [string, string]

export type Visibility = 'hidden' | 'visible' | 'disabled'

export type VisibilityResolver = (route: RouteRecordNormalized) => Visibility

declare module 'vue-router' {
  interface RouteMeta {
    label?: string | RouteLabelResolver
    icon?: IconName
    order?: number
    visibility?: Visibility | VisibilityResolver
  }
}
