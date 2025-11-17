// useTheme.ts
import { ref, watch } from 'vue'

export type Palette = 'lab' | 'premium' | 'neo'
export type Scheme = 'light' | 'dark'

export type ThemeId =
  | 'lab-light'
  | 'lab-dark'
  | 'premium-light'
  | 'premium-dark'
  | 'neo-light'
  | 'neo-dark'

const palette = ref<Palette>('lab')
const scheme = ref<Scheme>('light')

/**
 * Return the merged theme key like "lab-light"
 */
function getThemeId(): ThemeId {
  return `${palette.value}-${scheme.value}` as ThemeId
}

/**
 * Apply theme on document root
 */
function applyTheme() {
  const root = document.documentElement

  // Set unique data-theme value = "lab-light"
  root.setAttribute('data-theme', getThemeId())
}

/**
 * Change theme by giving palette + scheme
 * ex: setTheme('neo', 'dark')
 */
function setTheme(p: Palette, s: Scheme) {
  palette.value = p
  scheme.value = s
}

/**
 * Fast shortcut
 * example:
 *    setThemeId('neo-dark')
 */
function setThemeId(id: ThemeId) {
  const [p, s] = id.split('-') as [Palette, Scheme]
  palette.value = p
  scheme.value = s
}

watch([palette, scheme], applyTheme, { immediate: true })

export function useTheme() {
  return {
    palette,
    scheme,
    getThemeId,
    applyTheme,
    setTheme,
    setThemeId,
  }
}
