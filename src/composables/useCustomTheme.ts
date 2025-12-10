import { ref, watch } from 'vue'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getUiPreferences, updateUiPreferences } from '@/api/supabase/profiles'

export interface CustomThemeConfig {
  mode: 'preset' | 'custom'
  preset?: 'blue' | 'brown'
  customColor?: string // Hex color for custom mode
}

interface ColorShade {
  shade: number
  hex: string
  rgb: string
}

const THEME_STORAGE_KEY = 'custom-theme-config'
const DEFAULT_CONFIG: CustomThemeConfig = { mode: 'preset', preset: 'blue' }

// Singleton state
const themeConfig = ref<CustomThemeConfig>(DEFAULT_CONFIG)
const isLoading = ref(false)

/**
 * Convertit une couleur hex en HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convertit HSL en hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Convertit hex en RGB string
 */
function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

/**
 * Génère une palette complète à partir d'une couleur de base (hex)
 * Les nuances sont générées en gardant la même teinte (hue) et saturation,
 * mais en variant la luminosité pour avoir des niveaux cohérents.
 */
function generatePalette(baseColor: string): ColorShade[] {
  const { h, s } = hexToHsl(baseColor)

  // Définir les luminosités cibles pour chaque nuance
  // Du plus foncé (950) au plus clair (50)
  const shades: { shade: number; lightness: number }[] = [
    { shade: 950, lightness: 10 },
    { shade: 900, lightness: 15 },
    { shade: 800, lightness: 22 },
    { shade: 700, lightness: 32 },
    { shade: 600, lightness: 42 },
    { shade: 500, lightness: 52 },
    { shade: 400, lightness: 62 },
    { shade: 300, lightness: 72 },
    { shade: 200, lightness: 82 },
    { shade: 100, lightness: 90 },
    { shade: 50, lightness: 96 },
    { shade: 0, lightness: 98 },
  ]

  return shades.map(({ shade, lightness }) => {
    const hex = hslToHex(h, s, lightness)
    return {
      shade,
      hex,
      rgb: hexToRgb(hex),
    }
  })
}

/**
 * Applique les variables CSS au document
 *
 * IMPORTANT: Seule la palette PRIMARY est personnalisable.
 * La palette SECONDARY reste FIXE (base bleue-grise de l'app)
 * pour garantir la cohérence des surfaces et l'accessibilité.
 */
function applyCustomCssVariables(primaryPalette: ColorShade[]) {
  const root = document.documentElement

  // Appliquer UNIQUEMENT les couleurs primary (accent)
  // Les couleurs secondary (surfaces, textes) restent fixes
  primaryPalette.forEach(({ shade, hex, rgb }) => {
    root.style.setProperty(`--primary-${shade}`, hex)
    root.style.setProperty(`--primary-${shade}-rgb`, rgb)
  })
}

/**
 * Supprime les variables CSS custom (primary uniquement)
 * et remet les classes de thème preset
 */
function clearCustomCssVariables() {
  const root = document.documentElement

  // Supprimer les styles inline pour primary uniquement
  // (secondary n'est jamais modifiée en mode custom)
  const shadeNumbers = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000]

  shadeNumbers.forEach((shade) => {
    root.style.removeProperty(`--primary-${shade}`)
    root.style.removeProperty(`--primary-${shade}-rgb`)
  })
}

/**
 * Applique le thème selon la configuration
 *
 * ARCHITECTURE:
 * - Les presets (blue/brown) changent BOTH primary ET secondary
 * - Le mode custom change UNIQUEMENT primary (accents)
 * - La secondary (surfaces) reste celle du preset blue par défaut
 */
function applyTheme(config: CustomThemeConfig) {
  const html = document.documentElement

  if (config.mode === 'preset') {
    // Mode preset : utiliser les classes CSS existantes
    clearCustomCssVariables()
    html.classList.remove('theme-custom')
    html.classList.toggle('theme-brown', config.preset === 'brown')
    html.classList.toggle('theme-blue', config.preset === 'blue')
  } else if (config.mode === 'custom' && config.customColor) {
    // Mode custom : générer UNIQUEMENT la palette primary (accents)
    // La secondary reste fixe (base bleue-grise de l'app)
    html.classList.remove('theme-brown')
    html.classList.add('theme-blue') // Garder secondary blue comme base
    html.classList.add('theme-custom')

    const primaryPalette = generatePalette(config.customColor)
    applyCustomCssVariables(primaryPalette)
  }
}

/**
 * Sauvegarde la config dans localStorage
 */
function saveToLocalStorage(config: CustomThemeConfig) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
}

/**
 * Charge la config depuis localStorage
 */
function loadFromLocalStorage(): CustomThemeConfig | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as CustomThemeConfig
  } catch {
    return null
  }
}

export function useCustomTheme() {
  const auth = useAuthStore()

  /**
   * Charge la configuration depuis Supabase ou localStorage
   */
  async function loadConfig() {
    isLoading.value = true

    try {
      // D'abord essayer de charger depuis Supabase si connecté
      if (auth.user) {
        const prefs = await getUiPreferences(auth.user.id)
        if (prefs) {
          try {
            const parsed = JSON.parse(prefs)
            if (parsed.customTheme) {
              themeConfig.value = parsed.customTheme
              applyTheme(themeConfig.value)
              saveToLocalStorage(themeConfig.value)
              return
            }
          } catch {
            // JSON invalide, utiliser localStorage
          }
        }
      }

      // Fallback sur localStorage
      const localConfig = loadFromLocalStorage()
      if (localConfig) {
        themeConfig.value = localConfig
        applyTheme(themeConfig.value)
      } else {
        // Vérifier l'ancien format (blue/brown)
        const oldPreference = localStorage.getItem('theme-preference')
        if (oldPreference === 'brown') {
          themeConfig.value = { mode: 'preset', preset: 'brown' }
        } else {
          themeConfig.value = { mode: 'preset', preset: 'blue' }
        }
        applyTheme(themeConfig.value)
        saveToLocalStorage(themeConfig.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sauvegarde la configuration dans Supabase et localStorage
   */
  async function saveConfig(config: CustomThemeConfig) {
    themeConfig.value = config
    applyTheme(config)
    saveToLocalStorage(config)

    // Sauvegarder dans Supabase si connecté
    if (auth.user) {
      try {
        // Charger les prefs existantes pour les merger
        const existingPrefs = await getUiPreferences(auth.user.id)
        let prefs: Record<string, unknown> = {}

        if (existingPrefs) {
          try {
            prefs = JSON.parse(existingPrefs)
          } catch {
            // JSON invalide, partir de zéro
          }
        }

        prefs.customTheme = config
        await updateUiPreferences(auth.user.id, JSON.stringify(prefs))
      } catch (error) {
        console.warn('Erreur sauvegarde thème custom:', error)
      }
    }
  }

  /**
   * Définit un thème preset (blue ou brown)
   */
  function setPreset(preset: 'blue' | 'brown') {
    saveConfig({ mode: 'preset', preset })
  }

  /**
   * Définit une couleur custom
   */
  function setCustomColor(color: string) {
    saveConfig({ mode: 'custom', customColor: color })
  }

  /**
   * Réinitialise vers le thème par défaut
   */
  function resetToDefault() {
    saveConfig(DEFAULT_CONFIG)
  }

  // Watch pour réappliquer le thème si la config change
  watch(
    themeConfig,
    (config) => {
      applyTheme(config)
    },
    { deep: true },
  )

  return {
    config: themeConfig,
    isLoading,
    loadConfig,
    saveConfig,
    setPreset,
    setCustomColor,
    resetToDefault,
    generatePalette,
    hexToHsl,
    hslToHex,
  }
}

/**
 * Initialise le thème au chargement de l'app (à appeler dans main.ts ou App.vue)
 */
export function initCustomTheme() {
  const localConfig = loadFromLocalStorage()

  if (localConfig) {
    themeConfig.value = localConfig
    applyTheme(localConfig)
  } else {
    // Vérifier l'ancien format
    const oldPreference = localStorage.getItem('theme-preference')
    if (oldPreference === 'brown') {
      const config: CustomThemeConfig = { mode: 'preset', preset: 'brown' }
      themeConfig.value = config
      applyTheme(config)
      saveToLocalStorage(config)
    }
  }
}
