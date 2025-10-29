import { useScrollIntoView } from '@/features/interface/composables/useScrollIntoView'
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

// ✅ on autorise soit un tableau, soit un Ref/ComputedRef
export function useDropdownMenuHandler<T = DropdownItem>(
  items: T[] | Ref<T[]> | ComputedRef<T[]> = [],
  keyId?: keyof T,
  keyLabel?: keyof T,
  keyIconName?: keyof T,
  dropdownRef?: Ref<HTMLElement | null>,
) {
  const isOpen = ref(false)
  const dropdownDirection = ref<DropdownDirection>('down')
  const scrollRoot = ref<Element | null>(null)
  const io = ref<IntersectionObserver | null>(null)

  const { makeId, makeVisible } = useScrollIntoView()

  // ✅ Unref ici : fonctionne avec tableaux, ref, ou computed
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

  const updateDropdownVisibilityAndDirection = () => {
    const root = dropdownRef?.value
    if (!root) return

    const rect = root.getBoundingClientRect()
    const containerRect = (scrollRoot.value as HTMLElement | null)?.getBoundingClientRect()

    const topSpace = containerRect ? rect.top - containerRect.top : rect.top
    const bottomSpace = containerRect
      ? containerRect.bottom - rect.bottom
      : window.innerHeight - rect.bottom

    dropdownDirection.value = bottomSpace < 100 && topSpace > bottomSpace ? 'up' : 'down'
  }

  const detach = () => {
    io.value?.disconnect()
    io.value = null
  }

  const attach = async () => {
    detach()
    io.value = new IntersectionObserver(([entry]) => {
      if (!entry!.isIntersecting && isOpen.value) {
        isOpen.value = false
      }
    })

    if (dropdownRef?.value) {
      io.value.observe(dropdownRef.value)
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      scrollRoot.value = (dropdownRef?.value ?? null)?.closest?.('.scroll-container') ?? null
      await nextTick()
      updateDropdownVisibilityAndDirection()
      attach()
    } else {
      detach()
    }
  })

  onBeforeUnmount(detach)

  return {
    isOpen,
    dropdownDirection,
    computedItems,
    updateDropdownVisibilityAndDirection,
    makeId,
    makeVisible,
  }
}
