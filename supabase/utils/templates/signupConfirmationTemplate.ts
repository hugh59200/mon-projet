import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function signupConfirmationTemplate({
  full_name,
  url,
}: {
  full_name?: string
  url: string
}) {
  return baseEmailTemplate({
    title: 'Bienvenue chez FP Store',
    bodyHTML: `
      <p>Bonjour ${full_name || ''},</p>
      <p>Merci de votre inscription !</p>
      <p>Cliquez ci-dessous pour activer votre compte :</p>`,
    ctaLabel: 'Activer mon compte',
    ctaUrl: url,
  })
}
