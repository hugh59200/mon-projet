import type { DirectiveBinding } from 'vue'

interface HTMLElementWithHandler extends HTMLElement {
  __clickOutsideHandler__?: (event: MouseEvent) => void
}

export const vClickOutside = {
  mounted(el: HTMLElementWithHandler, binding: DirectiveBinding) {
    const excluded: HTMLElement[] = binding.value?.exclude || []
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInside = el.contains(target) || excluded.some((ex) => ex?.contains(target))
      if (!clickedInside) binding.value?.callback?.(e)
    }

    document.addEventListener('mousedown', handler)
    el.__clickOutsideHandler__ = handler
  },
  unmounted(el: HTMLElementWithHandler) {
    if (el.__clickOutsideHandler__) {
      document.removeEventListener('mousedown', el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__
    }
  },
}
