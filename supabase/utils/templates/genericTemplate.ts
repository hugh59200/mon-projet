import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function genericTemplate({
  title,
  message,
  ctaLabel,
  ctaUrl,
}: {
  title: string
  message: string
  ctaLabel?: string
  ctaUrl?: string
}) {
  return baseEmailTemplate({
    title,
    bodyHTML: `<p>${message}</p>`,
    ctaLabel,
    ctaUrl,
  })
}
