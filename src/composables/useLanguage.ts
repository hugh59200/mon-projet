import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  setLocale,
  getLocale,
} from '@/i18n'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export function useLanguage() {
  const { locale, t } = useI18n()

  const currentLocale = computed<SupportedLocale>({
    get: () => locale.value as SupportedLocale,
    set: (value: SupportedLocale) => {
      setLocale(value)
    },
  })

  const currentLocaleInfo = computed(() =>
    SUPPORTED_LOCALES.find(l => l.code === currentLocale.value),
  )

  const availableLocales = SUPPORTED_LOCALES

  function changeLocale(newLocale: SupportedLocale) {
    setLocale(newLocale)
  }

  return {
    t,
    locale: currentLocale,
    currentLocaleInfo,
    availableLocales,
    changeLocale,
    getLocale,
  }
}
