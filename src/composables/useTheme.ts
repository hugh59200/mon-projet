import { ref, watch, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark'
export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme-preference'

// État global partagé
const themePreference = ref<ThemePreference>('system')
const resolvedTheme = ref<ThemeMode>('light')
const isInitialized = ref(false)

/**
 * Détecte la préférence système (prefers-color-scheme)
 */
function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Applique le thème à l'élément <html>
 */
function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return

  document.documentElement.setAttribute('data-theme', theme)
  resolvedTheme.value = theme

  // Met à jour la meta theme-color pour mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0d14' : '#f8f9fb')
  }
}

/**
 * Résout le thème final basé sur la préférence
 */
function resolveTheme(preference: ThemePreference): ThemeMode {
  if (preference === 'system') {
    return getSystemTheme()
  }
  return preference
}

/**
 * Initialise le système de thème
 */
function initTheme() {
  if (isInitialized.value) return

  // Charge la préférence depuis localStorage
  const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    themePreference.value = stored
  }

  // Applique le thème initial
  applyTheme(resolveTheme(themePreference.value))

  // Écoute les changements de préférence système
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (themePreference.value === 'system') {
        applyTheme(getSystemTheme())
      }
    })
  }

  isInitialized.value = true
}

/**
 * Composable pour gérer le thème de l'application
 *
 * @example
 * ```ts
 * const { theme, preference, setTheme, toggleTheme } = useTheme()
 *
 * // Thème actuel résolu ('light' ou 'dark')
 * console.log(theme.value)
 *
 * // Préférence utilisateur ('light', 'dark', ou 'system')
 * console.log(preference.value)
 *
 * // Changer le thème
 * setTheme('dark')
 * setTheme('system') // Suit la préférence système
 *
 * // Toggle entre light et dark
 * toggleTheme()
 * ```
 */
export function useTheme() {
  // Initialise au premier appel
  onMounted(() => {
    initTheme()
  })

  // Watch les changements de préférence
  watch(themePreference, (newPref) => {
    localStorage.setItem(STORAGE_KEY, newPref)
    applyTheme(resolveTheme(newPref))
  })

  /**
   * Définit la préférence de thème
   */
  const setTheme = (preference: ThemePreference) => {
    themePreference.value = preference
  }

  /**
   * Toggle entre light et dark (ignore system)
   */
  const toggleTheme = () => {
    const current = resolvedTheme.value
    themePreference.value = current === 'light' ? 'dark' : 'light'
  }

  /**
   * Toggle entre les 3 modes: light → dark → system → light
   */
  const cycleTheme = () => {
    const modes: ThemePreference[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(themePreference.value)
    const nextIndex = (currentIndex + 1) % modes.length
    themePreference.value = modes[nextIndex] as ThemePreference
  }

  return {
    /** Thème actuel résolu ('light' ou 'dark') */
    theme: resolvedTheme,

    /** Préférence utilisateur ('light', 'dark', ou 'system') */
    preference: themePreference,

    /** Définit la préférence de thème */
    setTheme,

    /** Toggle entre light et dark */
    toggleTheme,

    /** Cycle entre light → dark → system */
    cycleTheme,

    /** Vérifie si le thème est dark */
    isDark: () => resolvedTheme.value === 'dark',

    /** Vérifie si le thème est light */
    isLight: () => resolvedTheme.value === 'light',
  }
}

// Initialisation immédiate pour éviter le flash
if (typeof window !== 'undefined') {
  // Applique le thème le plus tôt possible
  const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null
  const preference = stored || 'system'
  const theme = preference === 'system' ? getSystemTheme() : preference
  document.documentElement.setAttribute('data-theme', theme)
  resolvedTheme.value = theme
  themePreference.value = preference as ThemePreference
}
