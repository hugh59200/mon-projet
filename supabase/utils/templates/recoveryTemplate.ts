import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'

export function recoveryTemplate({
  url,
  locale = 'en',
}: {
  url: string
  locale?: Locale
}) {
  const t = translations.recovery

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML: `
      <p>${t.requestReceived[locale]}</p>
      <p>${t.ignoreIfNotYou[locale]}</p>`,
    ctaLabel: t.ctaReset[locale],
    ctaUrl: url,
    locale,
  })
}
