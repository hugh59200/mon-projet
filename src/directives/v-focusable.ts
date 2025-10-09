import { type Directive } from 'vue'

interface FocusableBinding {
  focusable?: boolean
  onEnter?: (event: KeyboardEvent) => void
}

export const focusableDirective: Directive = {
  mounted(el, binding) {
    setupFocusable(el, binding)
  },
  updated(el, binding) {
    setupFocusable(el, binding)
  },
  beforeUnmount(el) {
    if (el._onKeydown) {
      el.removeEventListener('keydown', el._onKeydown)
      delete el._onKeydown
    }
  },
}

function setupFocusable(el: HTMLElement, binding: any) {
  const bindingValue: FocusableBinding = binding.value || {}
  const isFocusable = bindingValue.focusable !== false
  const onEnter = typeof bindingValue.onEnter === 'function' ? bindingValue.onEnter : null

  if (isFocusable) {
    el.setAttribute('tabindex', '0')
    el.classList.add('focusable')

    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'button')
    }

    if (onEnter) {
      if (el._onKeydown) {
        el.removeEventListener('keydown', el._onKeydown)
      }
      el._onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onEnter(event)
        }
      }
      el.addEventListener('keydown', el._onKeydown)
    }
  } else {
    el.removeAttribute('tabindex')
    el.classList.remove('focusable')
    el.removeAttribute('role')

    if (el._onKeydown) {
      el.removeEventListener('keydown', el._onKeydown)
      delete el._onKeydown
    }
  }
}

// Extension de l'interface HTMLElement
declare global {
  interface HTMLElement {
    _onKeydown?: (event: KeyboardEvent) => void
  }
}
