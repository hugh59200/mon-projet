import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function emailChangeTemplate({ url }: { url: string }) {
  return baseEmailTemplate({
    title: 'Confirmez votre nouvelle adresse email 📫',
    bodyHTML: `<p>Cliquez ci-dessous pour confirmer le changement :</p>`,
    ctaLabel: 'Confirmer mon email',
    ctaUrl: url,
  })
}
