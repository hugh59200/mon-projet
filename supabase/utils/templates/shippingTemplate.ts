import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function shippingTemplate({
  order_number,
  full_name,
  item_count,
  carrier,
  tracking_number,
  tracking_url,
  ctaUrl,
}: {
  order_number: string
  full_name?: string
  item_count: number
  carrier?: string
  tracking_number?: string
  tracking_url?: string
  ctaUrl: string
}) {
  // URL de suivi : priorité au tracking_url fourni, sinon La Poste par défaut
  const finalTrackingUrl = tracking_url ||
    (tracking_number
      ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking_number}`
      : ctaUrl)

  const trackingBlock = tracking_number
    ? `
      <div style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:24px; margin:24px 0; text-align:center;">
        <p style="margin:0 0 8px; color:#166534; font-size:14px; font-weight:600; text-transform:uppercase;">
          Informations de suivi
        </p>
        <p style="margin:0 0 4px; color:#64748b; font-size:14px;">
          Transporteur : <strong style="color:#14532d;">${carrier || 'Standard'}</strong>
        </p>
        <p style="margin:0; font-family:monospace; font-size:20px; font-weight:700; color:#14532d; letter-spacing:1px;">
          ${tracking_number}
        </p>
      </div>
    `
    : `
      <div style="background-color:#fef3c7; border:1px solid #fde68a; border-radius:12px; padding:20px; margin:24px 0; text-align:center;">
        <p style="margin:0; color:#92400e; font-size:14px;">
          Le numéro de suivi sera disponible prochainement.
        </p>
      </div>
    `

  const bodyHTML = `
    <p>Bonjour <strong>${full_name || 'cher client'}</strong>,</p>

    <p>
      Excellente nouvelle ! Votre commande <strong>#${order_number}</strong> vient d'être expédiée.
    </p>

    <div style="margin: 24px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
        Contenu du colis
      </p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: #0f172a;">
        ${item_count} article${item_count > 1 ? 's' : ''}
      </p>
    </div>

    ${trackingBlock}

    <p style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #475569;">
      Pour voir le détail de votre commande, cliquez sur le bouton ci-dessous.
    </p>
  `

  return baseEmailTemplate({
    title: 'Votre colis est en route !',
    bodyHTML,
    ctaLabel: tracking_number ? 'Suivre mon colis' : 'Voir ma commande',
    ctaUrl: tracking_number ? finalTrackingUrl : ctaUrl,
  })
}
