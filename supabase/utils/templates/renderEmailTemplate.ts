// utils/templates/renderEmailTemplate.ts
import { genericTemplate } from './genericTemplate.ts'
import { orderConfirmationTemplate } from './orderConfirmation.ts'
import { signupConfirmationTemplate } from './signupConfirmation.ts'

type TemplateType =
  | 'confirmation'
  | 'signup_confirmation'
  | 'recovery'
  | 'email_change'
  | 'custom'
  | 'status_update'
  | 'payment'

export function renderEmailTemplate(type: TemplateType, data: any): string {
  switch (type) {
    case 'confirmation':
      return orderConfirmationTemplate(data)

    case 'signup_confirmation':
      return signupConfirmationTemplate(data)

    // ✅ Status update générique
    case 'status_update':
      return genericTemplate({
        title: 'Mise à jour de votre commande 🔔',
        message: data.message || 'Le statut de votre commande a été mis à jour.',
      })

    // ✅ Paiement
    case 'payment':
      return genericTemplate({
        title: 'Paiement confirmé ✅',
        message: `Votre paiement de ${data.amount}€ est confirmé.`,
      })

    // ✅ Réinitialisation mot de passe
    case 'recovery':
      return genericTemplate({
        title: 'Réinitialisation du mot de passe 🔐',
        message: `Cliquez ici pour réinitialiser votre mot de passe : <a href="${data.url}">${data.url}</a>`,
      })

    // ✅ Changement d’email
    case 'email_change':
      return genericTemplate({
        title: 'Confirmez votre nouvelle adresse email 📫',
        message: `Cliquez ici pour confirmer : <a href="${data.url}">${data.url}</a>`,
      })

    default:
      console.warn(`⚠ Template inconnue: ${type}`)
      return genericTemplate({
        title: 'Notification Fast Peptides',
        message: `Aucune template trouvée pour le type: <b>${type}</b>`,
      })
  }
}
