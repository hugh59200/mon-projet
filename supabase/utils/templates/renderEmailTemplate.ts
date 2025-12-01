// supabase/functions/utils/templates/renderEmailTemplate.ts (Modifié)

import { accountDeletedTemplate } from './accountDeletedTemplate.ts'
import { emailChangeTemplate } from './emailChangeTemplate.ts'
import { genericTemplate } from './genericTemplate.ts'
import { orderConfirmationTemplate } from './orderConfirmationTemplate.ts'
import { recoveryTemplate } from './recoveryTemplate.ts'
import { shippingTemplate } from './shippingTemplate.ts'
import { signupConfirmationTemplate } from './signupConfirmationTemplate.ts'

export function renderEmailTemplate(type: string, data: any) {
  switch (type) {
    case 'confirmation': {
      // Attend les données V2 : subtotal, shipping_cost, etc.
      return orderConfirmationTemplate(data)
    }

    case 'shipping': {
      return shippingTemplate(data)
    }

    case 'payment': {
      return genericTemplate({
        title: 'Paiement reçu 💳',
        message: `
          Nous confirmons la réception de votre paiement de <strong>${(Number(data.amount) || 0).toFixed(2)} €</strong>.<br/>
          Votre commande est maintenant validée et partira en préparation.
        `,
        ctaLabel: 'Voir ma commande',
        // Utilise l'URL par défaut pour un membre (puisque le paiement est souvent le point de départ)
        ctaUrl: `https://fast-peptides.com/profil/commandes/${data.order_id}`,
      })
    }

    case 'status_update': {
      const displayId = data.order_number ?? String(data.order_id).slice(0, 8)
      // 🆕 Récupère ctaUrl depuis les données passées par l'Edge Function
      const ctaUrl = data.ctaUrl ?? `https://fast-peptides.com/profil/commandes/${data.order_id}`

      return genericTemplate({
        title: `Mise à jour commande ${displayId}`,
        message: `
          Le statut de votre commande a évolué.<br/><br/>
          ${data.message ?? ''}
        `,
        ctaLabel: 'Voir les détails',
        // 🆕 Utilise l'URL dynamique
        ctaUrl: ctaUrl,
      })
    }

    case 'signup': {
      return signupConfirmationTemplate(data)
    }

    case 'recovery': {
      return recoveryTemplate(data)
    }

    case 'email_change': {
      return emailChangeTemplate(data)
    }

    case 'account_deleted': {
      return accountDeletedTemplate(data)
    }

    default: {
      return genericTemplate({
        title: 'Notification FP Store',
        message: 'Vous avez reçu une nouvelle notification.',
      })
    }
  }
}
