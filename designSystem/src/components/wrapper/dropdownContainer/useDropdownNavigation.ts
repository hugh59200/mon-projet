import { ref } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { DropdownItem } from '@designSystem/components'
import { useScrollIntoView } from '@/features/interface/composables/useScrollIntoView'

export function useDropdownNavigation<TDropdownItem = DropdownItem>(
  computedItems: ComputedRef<TDropdownItem[]>,
  isOpen: Ref<boolean>,
) {
  const selectIndex = ref(-1)
  const { makeId, makeVisible } = useScrollIntoView()

  const navigateToNextItem = () => {
    const canGoNext = selectIndex.value < computedItems.value.length - 1
    selectIndex.value = canGoNext ? selectIndex.value + 1 : 0
  }

  const navigateToPreviousItem = () => {
    const canGoPrevious = selectIndex.value > 0
    selectIndex.value = canGoPrevious ? selectIndex.value - 1 : computedItems.value.length - 1
  }

  const handleArrowDownKey = () => {
    if (!isOpen.value) {
      isOpen.value = true
    } else {
      navigateToNextItem()
      makeVisible(selectIndex.value)
    }
  }

  const handleArrowUpKey = () => {
    if (!isOpen.value) {
      isOpen.value = true
    } else {
      navigateToPreviousItem()
      makeVisible(selectIndex.value)
    }
  }

  const handleTab = () => {
    isOpen.value = false
  }

  const handleSpace = () => {
    if (!isOpen.value) isOpen.value = true
  }

  return {
    selectIndex,
    makeId,
    navigateToNextItem,
    navigateToPreviousItem,
    handleArrowDownKey,
    handleArrowUpKey,
    handleTab,
    handleSpace,
  }
}
