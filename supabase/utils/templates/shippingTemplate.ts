import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function shippingTemplate({
  order_id,
  full_name,
  carrier,
  tracking_number,
  tracking_url,
  items = [],
}: {
  order_id: string
  full_name?: string
  carrier?: string
  tracking_number?: string
  tracking_url?: string
  items: { name: string; quantity: number }[]
}) {
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="text-align:center;padding:8px 12px;">${i.quantity}</td>
      </tr>`,
    )
    .join('')

  const bodyHTML = `
    <p>Bonjour ${full_name || 'cher client'},</p>

    <p>Bonne nouvelle ! Votre commande <strong>#${order_id}</strong> est maintenant expédiée ✅</p>

    <p>Transporteur : <b>${carrier || 'Non communiqué'}</b><br/>
    Numéro de suivi : <b>${tracking_number || '—'}</b></p>

    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;">
      <thead style="background:#f7f7f7;">
        <tr>
          <th align="left" style="padding:8px 12px;">Produit</th>
          <th align="center" style="padding:8px 12px;">Qté</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <p style="margin-top:16px;">Vous pouvez suivre l’acheminement en temps réel :</p>
  `

  return baseEmailTemplate({
    title: 'Votre commande est expédiée 📦',
    bodyHTML,
    ctaLabel: tracking_url ? 'Suivre mon colis' : undefined,
    ctaUrl: tracking_url,
  })
}
