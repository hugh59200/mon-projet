import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'
import { APP_BASE_URL } from '../clients.ts'

export function accountDeletedTemplate({
  email,
  locale = 'en',
}: {
  email: string
  locale?: Locale
}) {
  const t = translations.accountDeleted

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML: `
      <p>${t.greeting[locale]}</p>
      <p>${t.confirmation[locale](email)}</p>

      <p>${t.notYouWarning[locale]}</p>
    `,
    ctaLabel: t.ctaContactSupport[locale],
    ctaUrl: `${APP_BASE_URL}/contact`,
    locale,
  })
}
