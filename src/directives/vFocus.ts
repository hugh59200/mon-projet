import type { Directive, DirectiveBinding } from 'vue'

interface FocusableBinding {
  focusable?: boolean
  onEnter?: (event: KeyboardEvent) => void
}

interface FocusableEl extends HTMLElement {
  _onKeydown?: (event: KeyboardEvent) => void
}

export const vFocusable: Directive<FocusableEl, FocusableBinding> = {
  mounted: setupFocusable,
  updated: setupFocusable,
  beforeUnmount(el) {
    if (el._onKeydown) {
      el.removeEventListener('keydown', el._onKeydown)
      delete el._onKeydown
    }
  },
}

function setupFocusable(el: FocusableEl, binding: DirectiveBinding<FocusableBinding>) {
  const { focusable = true, onEnter } = binding.value ?? {}

  if (!focusable) {
    el.removeAttribute('tabindex')
    el.classList.remove('focusable')
    el.removeAttribute('role')
    if (el._onKeydown) {
      el.removeEventListener('keydown', el._onKeydown)
      delete el._onKeydown
    }
    return
  }

  el.setAttribute('tabindex', '0')
  el.classList.add('focusable')
  if (!el.hasAttribute('role')) el.setAttribute('role', 'button')

  if (onEnter) {
    if (el._onKeydown) el.removeEventListener('keydown', el._onKeydown)
    el._onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onEnter(event)
      }
    }
    el.addEventListener('keydown', el._onKeydown)
  }
}

declare module 'vue' {
  interface GlobalDirectives {
    vFocusable: typeof vFocusable
  }
}
