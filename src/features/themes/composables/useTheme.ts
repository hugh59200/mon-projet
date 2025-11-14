// useTheme.ts
import { ref, watch } from 'vue'

export type Palette = 'lab' | 'premium' | 'neo'
export type Scheme = 'light' | 'dark'

const palette = ref<Palette>('lab')
const scheme = ref<Scheme>('light')

function applyTheme() {
  const root = document.documentElement
  root.dataset.palette = palette.value
  root.dataset.theme = scheme.value
}

watch([palette, scheme], applyTheme, { immediate: true })

export function useTheme() {
  return { palette, scheme, applyTheme }
}
