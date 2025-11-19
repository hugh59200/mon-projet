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
  const bodyHTML = `
    <p style="margin:0 0 12px;">${message}</p>
  `

  return baseEmailTemplate({
    title,
    bodyHTML,
    ctaLabel,
    ctaUrl,
  })
}
