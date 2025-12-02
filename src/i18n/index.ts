import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'

export type SupportedLocale = 'fr' | 'en'

export const SUPPORTED_LOCALES: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export const DEFAULT_LOCALE: SupportedLocale = 'fr'

function getInitialLocale(): SupportedLocale {
  // Check localStorage first
  const stored = localStorage.getItem('user-locale')
  if (stored && SUPPORTED_LOCALES.some(l => l.code === stored)) {
    return stored as SupportedLocale
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (SUPPORTED_LOCALES.some(l => l.code === browserLang)) {
    return browserLang as SupportedLocale
  }

  return DEFAULT_LOCALE
}

const i18n = createI18n({
  legacy: false, // Composition API mode
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    fr,
    en,
  },
})

export default i18n

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('user-locale', locale)
  document.documentElement.lang = locale
}

export function getLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale
}
