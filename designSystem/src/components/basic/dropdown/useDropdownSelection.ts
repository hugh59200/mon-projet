import type { DropdownId, DropdownItem } from '@designSystem/components'
import { computed, type Ref } from 'vue'

interface UseDropdownSelectionOptions {
  mode?: 'single' | 'multiple'
  readonly?: boolean
  items: Ref<DropdownItem[] | undefined>
  model: Ref<DropdownId | DropdownId[] | undefined>
}

/**
 * Gère la logique de sélection (single / multiple)
 */
export function useDropdownSelection({
  mode = 'single',
  readonly = false,
  items,
  model,
}: UseDropdownSelectionOptions) {
  const isMultiple = computed(() => mode === 'multiple')

  const isActive = (id: DropdownId) => {
    return isMultiple.value
      ? Array.isArray(model.value) && model.value.includes(id)
      : model.value === id
  }

  const selectItem = (id: DropdownId) => {
    if (readonly) return

    if (isMultiple.value) {
      const current = Array.isArray(model.value) ? model.value : []
      model.value = current.includes(id) ? current.filter((v) => v !== id) : [...current, id]
    } else {
      model.value = model.value === id ? undefined : id
    }
  }

  const selectedLabel = computed(() => {
    const list = items.value ?? []
    if (isMultiple.value) {
      const selectedIds = Array.isArray(model.value) ? model.value : []
      return list
        .filter((i) => selectedIds.includes(i.id))
        .map((i) => i.label)
        .join(', ')
    } else {
      const item = list.find((i) => i.id === model.value)
      return item ? item.label : ''
    }
  })

  return { isMultiple, isActive, selectItem, selectedLabel }
}
