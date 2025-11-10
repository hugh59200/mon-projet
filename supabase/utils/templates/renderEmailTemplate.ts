import { genericTemplate } from './genericTemplate.ts'
import { orderConfirmationTemplate } from './orderConfirmation.ts'
import { signupConfirmationTemplate } from './signupConfirmation.ts'

export function renderEmailTemplate(type: string, data: any) {
  switch (type) {
    case 'confirmation':
      return orderConfirmationTemplate(data)

    case 'signup':
      return signupConfirmationTemplate(data)

    case 'payment':
      return genericTemplate({
        title: 'Paiement confirmé ✅',
        message: `Votre paiement de ${data.amount}€ a bien été reçu.`,
      })

    case 'status_update':
      return genericTemplate({
        title: 'Mise à jour de votre commande 🔔',
        message: data.message ?? 'Votre commande a été mise à jour.',
      })

    case 'recovery':
      return genericTemplate({
        title: 'Réinitialisation du mot de passe 🔐',
        message: `Cliquez ici pour réinitialiser : <a href="${data.url}">${data.url}</a>`,
      })

    case 'email_change':
      return genericTemplate({
        title: 'Confirmez votre nouvelle adresse email 📫',
        message: `<a href="${data.url}">${data.url}</a>`,
      })

    default:
      return genericTemplate({
        title: 'Notification Fast Peptides',
        message: 'Aucune template associée.',
      })
  }
}
