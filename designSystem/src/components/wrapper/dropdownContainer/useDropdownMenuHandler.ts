import type { DropdownItem } from '@designSystem/components'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  unref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'

export type DropdownDirection = 'up' | 'down'

export function useDropdownMenuHandler<T = DropdownItem>(
  items: T[] | Ref<T[]> | ComputedRef<T[]> = [],
  keyId?: keyof T,
  keyLabel?: keyof T,
  keyIconName?: keyof T,
  dropdownRef?: Ref<HTMLElement | null>,
) {
  const isOpen = ref(false)
  const dropdownDirection = ref<DropdownDirection>('down')
  const io = ref<IntersectionObserver | null>(null)

  const resolvedItems = computed(() => unref(items) ?? [])

  const computedItems = computed<DropdownItem[]>(() =>
    resolvedItems.value.map((item: T) => ({
      id: item[(keyId as keyof T) ?? ('id' as keyof T)] as DropdownItem['id'],
      label: item[(keyLabel as keyof T) ?? ('label' as keyof T)] as DropdownItem['label'],
      iconName: item[
        (keyIconName as keyof T) ?? ('iconName' as keyof T)
      ] as DropdownItem['iconName'],
    })),
  )

  /**
   * 📏 Vérifie la place disponible et décide de la direction du menu
   */
  const updateDropdownVisibilityAndDirection = async () => {
    await nextTick()
    const el = dropdownRef?.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // Hauteur estimée du menu (ou fallback 200px)
    const estimatedMenuHeight = 240

    // Si on n’a pas la place en bas, et qu’en haut c’est mieux => on ouvre vers le haut
    dropdownDirection.value =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? 'up' : 'down'
  }

  /**
   * 👁️ Ferme le dropdown quand il sort du viewport
   */
  const attachObserver = () => {
    if (!dropdownRef?.value) return
    detachObserver()

    io.value = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting && isOpen.value) {
          isOpen.value = false
        }
      },
      { threshold: 0.01 },
    )

    io.value.observe(dropdownRef.value)
  }

  const detachObserver = () => {
    io.value?.disconnect()
    io.value = null
  }

  watch(isOpen, async (open) => {
    if (open) {
      await updateDropdownVisibilityAndDirection()
      attachObserver()
    } else {
      detachObserver()
    }
  })

  onBeforeUnmount(detachObserver)

  return {
    isOpen,
    dropdownDirection,
    computedItems,
    updateDropdownVisibilityAndDirection,
  }
}
