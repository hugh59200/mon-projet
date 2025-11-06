// utils/templates/orderStatus.ts
import { getStatusMessage } from '../getStatusMessage.ts'
import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function orderStatusTemplate({
  full_name,
  status,
  carrier,
  tracking_number,
}: {
  full_name?: string
  status: string
  carrier?: string
  tracking_number?: string
}): string {
  const message = getStatusMessage(status, carrier, tracking_number)

  const body = `
    <p>Bonjour ${full_name || 'cher client'},</p>
    <p>${message}</p>
    <p style="margin-top:32px;">Merci pour votre confiance 🙌</p>
  `

  return baseEmailTemplate({
    title: 'Mise à jour de votre commande 🧬',
    bodyHTML: body,
  })
}
