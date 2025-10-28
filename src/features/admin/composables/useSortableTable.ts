import type { IconColor } from '@designSystem/index'
import type { Ref } from 'vue'

export function useSortableTable<T extends string>(sortKey: Ref<T>, sortAsc: Ref<boolean>) {
  function toggleSort(newKey: T) {
    if (sortKey.value === newKey) sortAsc.value = !sortAsc.value
    else {
      sortKey.value = newKey
      sortAsc.value = true
    }
  }

  function getSortColor(k: T): IconColor {
    if (sortKey.value !== k) return 'gray-800' as IconColor
    return sortAsc.value ? 'primary-600' : 'primary-400'
  }

  return { toggleSort, getSortColor }
}
