import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumb() {
  const route = useRoute()

  const crumbs = computed(() => {
    return route.matched
      .filter((r) => r.meta?.breadcrumb || r.meta?.label)
      .map((r) => {
        const raw = r.meta.breadcrumb || r.meta.label
        const label = typeof raw === 'function' ? raw(route) : raw

        return {
          label,
          to: r.path === route.path ? null : r.path,
          icon: r.meta.icon || null,
        }
      })
  })

  return { crumbs }
}
