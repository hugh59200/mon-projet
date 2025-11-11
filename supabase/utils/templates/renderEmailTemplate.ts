import { accountDeletedTemplate } from './accountDeletedTemplate.ts'
import { emailChangeTemplate } from './emailChangeTemplate.ts'
import { genericTemplate } from './genericTemplate.ts'
import { orderConfirmationTemplate } from './orderConfirmationTemplate.ts'
import { recoveryTemplate } from './recoveryTemplate.ts'
import { shippingTemplate } from './shippingTemplate.ts'
import { signupConfirmationTemplate } from './signupConfirmationTemplate.ts'

export function renderEmailTemplate(type: string, data: any) {
  switch (type) {
    case 'confirmation':
      return orderConfirmationTemplate(data)

    case 'payment':
      return genericTemplate({
        title: 'Paiement confirmé ✅',
        message: `Votre paiement de ${(Number(data.amount) || 0).toFixed(2)}€ a bien été reçu.`,
        ctaLabel: 'Voir ma commande',
        ctaUrl: `https://fast-peptides.com/compte/commande/${data.order_id}`,
      })

    case 'shipping':
      return shippingTemplate(data)

    case 'status_update':
      return genericTemplate({
        title: 'Mise à jour de votre commande 🔔',
        message: data.message ?? 'Votre commande a été mise à jour.',
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
      })

    case 'signup':
      return signupConfirmationTemplate(data)

    case 'recovery':
      return recoveryTemplate(data)

    case 'email_change':
      return emailChangeTemplate(data)

    case 'account_deleted':
      return accountDeletedTemplate(data)

    default:
      return genericTemplate({
        title: 'Notification Fast Peptides',
        message: 'Aucune template associée.',
      })
  }
}
