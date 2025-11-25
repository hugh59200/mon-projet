import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function orderConfirmationTemplate({
  order_id,
  order_number,
  full_name,
  subtotal,
  shipping_cost,
  total_amount,
  items = [],
  created_at,
}: {
  order_id: string
  order_number?: string
  full_name?: string
  subtotal?: number
  shipping_cost?: number
  total_amount: number
  created_at: string
  // ✅ AJOUT du type dosage
  items: { name: string; dosage?: string; quantity: number; price: number }[]
}) {
  // Priorité au numéro FP-2025-XXX
  const displayId = order_number ?? order_id.slice(0, 8).toUpperCase()

  // Génération des lignes produits
  const rows = items
    .map((i) => {
      // 🧠 Logique d'affichage du dosage (comme sur le Frontend)
      const showDosage = i.dosage && !i.name.includes(i.dosage)

      // Construction du HTML pour le nom + dosage éventuel
      const nameHtml = showDosage
        ? `<span style="display:block;font-weight:600;color:#1e293b;">${i.name}</span>
           <span style="display:block;font-size:12px;color:#00796B;margin-top:2px;">Dosage : ${i.dosage}</span>`
        : `<span style="display:block;font-weight:600;color:#1e293b;">${i.name}</span>`

      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
            ${nameHtml}
          </td>
          <td style="text-align:center;padding:12px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">
            x${i.quantity}
          </td>
          <td style="text-align:right;padding:12px 0;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1e293b;">
            ${(i.quantity * i.price).toFixed(2)} €
          </td>
        </tr>
      `
    })
    .join('')

  // Gestion affichage livraison
  const shippingLabel =
    !shipping_cost || shipping_cost === 0 ? 'Offerte' : `${shipping_cost.toFixed(2)} €`

  // Calcul sous-total fallback
  const subtotalDisplay = subtotal
    ? subtotal.toFixed(2)
    : items.reduce((acc, i) => acc + i.quantity * i.price, 0).toFixed(2)

  const bodyHTML = `
    <p>Bonjour <strong>${full_name || 'cher client'}</strong>,</p>

    <p>
      Nous avons bien reçu votre commande <strong>${displayId}</strong> passée le 
      ${new Date(created_at).toLocaleDateString('fr-FR')}. 
      Elle est en cours de traitement.
    </p>

    <div style="margin: 24px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
      <h3 style="margin-top:0; margin-bottom:16px; font-size:16px; color:#0f172a;">Récapitulatif</h3>
      
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="margin-top: 16px; padding-top: 16px; border-top: 2px dashed #e2e8f0;">
        <table style="width:100%; font-size:14px;">
          <tr>
            <td style="padding-bottom:8px; color:#64748b;">Sous-total</td>
            <td style="text-align:right; padding-bottom:8px; color:#1e293b;">${subtotalDisplay} €</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px; color:#64748b;">Livraison</td>
            <td style="text-align:right; padding-bottom:8px; color:#1e293b;">${shippingLabel}</td>
          </tr>
          <tr>
            <td style="padding-top:8px; font-weight:700; font-size:18px; color:#0f172a;">Total</td>
            <td style="text-align:right; padding-top:8px; font-weight:700; font-size:18px; color:#00796B;">
              ${total_amount.toFixed(2)} €
            </td>
          </tr>
        </table>
      </div>
    </div>

    <p>
      Vous recevrez un nouvel email avec le numéro de suivi dès que votre colis sera expédié 🚚.
    </p>
  `

  return baseEmailTemplate({
    title: `Commande confirmée ✅`,
    bodyHTML,
    ctaLabel: 'Suivre ma commande',
    ctaUrl: `https://fast-peptides.com/profil/commandes/${order_id}`,
  })
}
