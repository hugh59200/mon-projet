// composables/useDropdownPosition.ts
import { nextTick, ref, type Ref } from 'vue'
import type { DropdownDirection } from './useDropdownMenuHandler'

export function useDropdownPosition(
  dropdownRef: Ref<HTMLElement | null>,
  menuRef: Ref<HTMLElement | null>,
  dropdownDirection: Ref<DropdownDirection>,
) {
  const menuPositionStyle = ref<Record<string, string>>({})

  const updatePosition = async () => {
    if (!dropdownRef.value) return
    await nextTick()

    const rect = dropdownRef.value.getBoundingClientRect()
    const direction = dropdownDirection.value

    menuPositionStyle.value = {
      position: 'absolute',
      top:
        direction === 'down'
          ? `${rect.bottom + window.scrollY}px`
          : `${rect.top + window.scrollY - (menuRef.value?.offsetHeight || 0)}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      zIndex: '9999',
    }
  }

  return { menuPositionStyle, updatePosition }
}
