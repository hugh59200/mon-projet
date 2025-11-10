// utils/templates/signupConfirmation.ts
import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function signupConfirmationTemplate({
  full_name = 'Cher client',
  confirmation_url,
}: {
  full_name?: string
  confirmation_url: string
}) {
  const bodyHTML = `
    <p>Bonjour ${full_name},</p>
    <p>Merci de votre inscription sur Fast Peptides 🧬</p>
    <p>Pour activer votre compte, cliquez ci-dessous :</p>
    <p>Ce lien est valide pendant une durée limitée.</p>
  `

  return baseEmailTemplate({
    title: 'Confirmez votre inscription 🎉',
    bodyHTML,
    ctaLabel: '✅ Confirmer mon email',
    ctaUrl: confirmation_url,
  })
}
