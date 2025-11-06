import { orderConfirmationTemplate } from './orderConfirmation.ts'
import { orderStatusTemplate } from './orderStatus.ts'
import { paymentConfirmationTemplate } from './paymentConfirmation.ts'

type TemplateType = 'confirmation' | 'status_update' | 'payment' | 'cancelation' | 'custom'

export function renderEmailTemplate(type: TemplateType, data: any): string {
  switch (type) {
    case 'confirmation':
      return orderConfirmationTemplate(data)

    case 'status_update':
      return orderStatusTemplate(data)

    case 'payment':
      return paymentConfirmationTemplate(data)

    default:
      console.warn(`⚠️ Template inconnu : ${type}`)
      return `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>Notification Fast Peptides</h2>
          <p>Aucune template trouvée pour le type : <b>${type}</b></p>
        </div>
      `
  }
}
