import { defineStore } from "pinia"
import { computed, shallowRef, VueElement } from "vue"

export type WebComponentNode = {
  shadowRoot: ShadowRoot,
  host: VueElement
}

export const useWebComponentNode = defineStore('web-component-node', () => {

  const componentNode = shallowRef<WebComponentNode | null>(null)

  function initialise(shadowRoot: ShadowRoot | null, host: VueElement | null) {
    if (componentNode.value) return
    if (!shadowRoot || !host) return
    componentNode.value = { shadowRoot, host }
  }

  const shadowRoot = computed<ShadowRoot | null>(() => componentNode.value?.shadowRoot ?? null)
  const host = computed<VueElement | null>(() => componentNode.value?.host ?? null)

  return {
    initialise,
    shadowRoot,
    host
  }
})
