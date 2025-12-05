import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'
import { EMAIL_ASSETS } from '../emailAssets.ts'

export function emailChangeTemplate({
  url,
  locale = 'en',
}: {
  url: string
  locale?: Locale
}) {
  const t = translations.emailChange

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML: `<p>${t.confirmPrompt[locale]}</p>`,
    ctaLabel: t.ctaConfirm[locale],
    ctaUrl: url,
    heroImage: EMAIL_ASSETS['email-verify'],
    locale,
  })
}
