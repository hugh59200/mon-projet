import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function recoveryTemplate({ url }: { url: string }) {
  return baseEmailTemplate({
    title: 'Réinitialisation du mot de passe 🔐',
    bodyHTML: `
      <p>Nous avons reçu une demande de réinitialisation.</p>
      <p>Si ce n’est pas vous, ignorez cet email.</p>`,
    ctaLabel: 'Réinitialiser mon mot de passe',
    ctaUrl: url,
  })
}
