import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'

export function signupConfirmationTemplate({
  full_name,
  url,
  locale = 'en',
}: {
  full_name?: string
  url: string
  locale?: Locale
}) {
  const t = translations.signup

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML: `
      <p>${t.greeting[locale](full_name || '')}</p>
      <p>${t.thanks[locale]}</p>
      <p>${t.activatePrompt[locale]}</p>`,
    ctaLabel: t.ctaActivate[locale],
    ctaUrl: url,
    locale,
  })
}
