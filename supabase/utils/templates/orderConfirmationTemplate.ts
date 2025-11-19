import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function orderConfirmationTemplate({
  order_id,
  full_name,
  total_amount,
  items = [],
  created_at,
}: {
  order_id: string
  full_name?: string
  total_amount: number
  created_at: string
  items: { name: string; quantity: number; price: number }[]
}) {
  // ID minifié pour l'affichage
  const shortId = order_id.slice(0, 8)

  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="text-align:center;padding:10px 12px;">${i.quantity}</td>
          <td style="text-align:right;padding:10px 12px;">${(i.quantity * i.price).toFixed(2)} €</td>
        </tr>
      `,
    )
    .join('')

  const bodyHTML = `
    <p>Bonjour ${full_name || 'cher client'},</p>

    <p>
      Merci pour votre commande <strong>#${shortId}</strong> passée le 
      ${new Date(created_at).toLocaleDateString('fr-FR')}.
    </p>

    <p style="margin-bottom:12px;">Voici un récapitulatif :</p>

    <table
      style="
        border-collapse:collapse;
        width:100%;
        border:1px solid #eee;
        font-size:14px;
      "
    >
      <thead style="background:#f7f7f7;">
        <tr>
          <th align="left" style="padding:10px 12px;">Produit</th>
          <th align="center" style="padding:10px 12px;">Qté</th>
          <th align="right" style="padding:10px 12px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <p style="text-align:right;margin-top:16px;font-size:16px;">
      <strong>Total : ${total_amount.toFixed(2)} €</strong>
    </p>

    <p style="margin-top:24px;">
      Nous vous tiendrons informé dès que votre commande sera expédiée.
    </p>
  `

  return baseEmailTemplate({
    title: `Confirmation de votre commande 🎉`,
    bodyHTML,
    ctaLabel: 'Voir ma commande',
    ctaUrl: `https://fast-peptides.com/compte/commandes/${order_id}`,
  })
}
