import { baseEmailTemplate } from './baseEmailTemplate.ts'
import type { Locale } from '../i18n.ts'

export function genericTemplate({
  title,
  message,
  ctaLabel,
  ctaUrl,
  locale = 'en',
}: {
  title: string
  message: string
  ctaLabel?: string
  ctaUrl?: string
  locale?: Locale
}) {
  const bodyHTML = `
    <p style="margin:0 0 12px;">${message}</p>
  `

  return baseEmailTemplate({
    title,
    bodyHTML,
    ctaLabel,
    ctaUrl,
    locale,
  })
}
