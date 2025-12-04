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
    const offsetDown = -4
    const offsetUp = 14

    const menuHeight = menuRef.value?.offsetHeight || 0

    const leftPosition = `${rect.left + window.scrollX}px`

    menuPositionStyle.value = {
      position: 'absolute',
      top:
        direction === 'down'
          ? `${rect.bottom + window.scrollY + offsetDown}px`
          : `${rect.top + window.scrollY - menuHeight - offsetUp}px`,
      left: leftPosition,
      width: `${rect.width}px`,
      zIndex: '9999',
    }
  }

  return { menuPositionStyle, updatePosition }
}
