// utils/templates/paymentConfirmation.ts
import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function paymentConfirmationTemplate({
  amount,
  sessionId,
}: {
  amount: number
  sessionId: string
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
  })
}
