// utils/templates/paymentConfirmation.ts
import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function paymentConfirmationTemplate({
  amount,
  sessionId,
  order_id,
}: {
  amount: number
  sessionId: string
  order_id?: string
}) {
  const bodyHTML = `
    <p>Merci pour votre commande 🙏</p>
    <p>Montant : <strong>${amount.toFixed(2)} €</strong></p>
    <p>ID de session : <code>${sessionId}</code></p>
    <p style="margin-top:24px;">Votre commande est en cours de traitement 🧬</p>
  `

  return baseEmailTemplate({
    title: 'Paiement confirmé 💳',
    bodyHTML,
    ctaLabel: order_id ? 'Voir ma commande' : undefined,
    ctaUrl: order_id ? `https://fastpeptides.com/compte/commande/${order_id}` : undefined,
  })
}
