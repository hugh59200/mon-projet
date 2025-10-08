import { type Ref } from 'vue'
import { useHandleEvent } from './useHandleEvent'
import { useWebComponentNode } from './useWebComponentNode'

function isClickInProtectedElements(target: Node, elements: Array<Ref<HTMLElement | null>>): boolean {
  return elements?.some((ref) => ref.value && ref.value.contains(target))
}

export function useHandleClickOutside(
  refs: Ref<HTMLElement | null> | Array<Ref<HTMLElement | null>>,
  onClickOutside: (event: MouseEvent) => void,
) {
  let pause = false

  const protectedElements = Array.isArray(refs) ? refs : [refs]
  const shadowRoot = useWebComponentNode().shadowRoot

  useHandleEvent(shadowRoot ?? document, 'mousedown', (event: MouseEvent) => {
    if (pause) return
    if (!isClickInProtectedElements(event.target as Node, protectedElements)) {
      onClickOutside(event)
    }
    if (shadowRoot) event.stopPropagation()
  })

  if (shadowRoot) {
    useHandleEvent(document, 'mousedown', (event: MouseEvent) => {
      if (pause) return
      if (!isClickInProtectedElements(event.target as Node, protectedElements)) {
        onClickOutside(event)
      }
    })
  }

  async function pauseClickOutside(callback: () => void | Promise<void>) {
    try {
      pause = true
      await callback()
    } finally {
      pause = false
    }
  }

  return { pauseClickOutside }
}
