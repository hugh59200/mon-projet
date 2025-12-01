import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function accountDeletedTemplate({ email }: { email: string }) {
  return baseEmailTemplate({
    title: 'Votre compte a été supprimé ✅',
    bodyHTML: `
      <p>Bonjour,</p>
      <p>Nous confirmons que votre compte associé à l’adresse 
        <strong>${email}</strong> a bien été supprimé de notre plateforme.</p>

      <p>Si cette action n’a pas été effectuée par vous,
         merci de contacter notre support dans les plus brefs délais.</p>
    `,
    ctaLabel: 'Contacter le support',
    ctaUrl: 'https://fast-peptides.com/contact',
  })
}
