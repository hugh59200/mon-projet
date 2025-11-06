import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function orderConfirmationTemplate({
  order_id,
  full_name,
  total_amount,
  items,
  created_at,
}: {
  order_id: string
  full_name?: string
  total_amount: number
  items: { name: string; quantity: number; price: number }[]
  created_at: string
}) {
  const productRows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="text-align:center;padding:8px 12px;">${i.quantity}</td>
          <td style="text-align:right;padding:8px 12px;">${(i.price * i.quantity).toFixed(2)} €</td>
        </tr>`,
    )
    .join('')

  const bodyHTML = `
    <p>Bonjour ${full_name || 'cher client'},</p>
    <p>
      Nous avons bien reçu votre commande <strong>#${order_id}</strong> 
      le ${new Date(created_at).toLocaleDateString('fr-FR')}.
    </p>

    <p>Voici le récapitulatif :</p>

    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;font-size:14px;margin-top:10px;">
      <thead style="background:#f7f7f7;">
        <tr>
          <th align="left" style="padding:8px 12px;">Produit</th>
          <th align="center" style="padding:8px 12px;">Qté</th>
          <th align="right" style="padding:8px 12px;">Total</th>
        </tr>
      </thead>
      <tbody>${productRows}</tbody>
    </table>

    <p style="text-align:right;margin-top:16px;font-size:16px;">
      <b>Total : ${total_amount.toFixed(2)} €</b>
    </p>

    <p style="margin-top:24px;">Nous vous tiendrons informé dès que votre commande sera expédiée 🚚</p>
  `

  return baseEmailTemplate({
    title: 'Confirmation de votre commande 🎉',
    bodyHTML,
  })
}
