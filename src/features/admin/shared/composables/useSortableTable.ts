// src/features/admin/shared/composables/useSortableTable.ts
import type { IconColor } from '@designSystem/index'
import type { Ref } from 'vue'

/**
 * Keys triables autorisées : string | number | boolean | Date | null | undefined
 */
type SortablePrimitive = string | number | boolean | Date | null | undefined

/**
 * Extrait uniquement les clés triables d'un type de table Supabase
 */
type SortableKeys<T> = {
  [K in keyof T]: T[K] extends SortablePrimitive ? K : never
}[keyof T]

export function useSortableTable<
  T extends Record<string, any>,
  K extends SortableKeys<T> = SortableKeys<T>,
>(sortKey: Ref<K | string>, sortAsc: Ref<boolean>, filteredData: Ref<T[]>) {
  function toggleSort(newKey: K | string) {
    if (sortKey.value === newKey) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = newKey
      sortAsc.value = true
    }

    const dir = sortAsc.value ? 1 : -1

    // ⚡ Tri local strictement typé
    const sorted = [...filteredData.value].sort((a, b) => {
      const valA = a[newKey as keyof T] as SortablePrimitive
      const valB = b[newKey as keyof T] as SortablePrimitive

      if (valA == null && valB == null) return 0
      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir
      }

      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return (valA === valB ? 0 : valA ? 1 : -1) * dir
      }

      if (valA instanceof Date && valB instanceof Date) {
        return (valA.getTime() - valB.getTime()) * dir
      }

      // fallback pour tout le reste
      return String(valA).localeCompare(String(valB)) * dir
    })

    filteredData.value = sorted
  }

  function getSortColor(k: K | string): IconColor {
    if (sortKey.value !== k) return 'gray-800' as IconColor
    return sortAsc.value ? 'primary-600' : 'primary-400'
  }

  return { toggleSort, getSortColor }
}
