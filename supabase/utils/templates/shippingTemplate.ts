// supabase/functions/utils/templates/shippingTemplate.ts

import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function shippingTemplate({
  order_id,
  order_number,
  full_name,
  carrier,
  tracking_number,
  tracking_url,
  items = [],
}: {
  order_id: string
  order_number?: string
  full_name?: string
  carrier?: string
  tracking_number?: string
  tracking_url?: string
  items: { name: string; quantity: number }[]
}) {
  const displayId = order_number ?? order_id.slice(0, 8).toUpperCase()

  // Liste simplifiée des items
  const itemsList = items
    .map((i) => `<li style="margin-bottom:4px;">${i.quantity}x <strong>${i.name}</strong></li>`)
    .join('')

  const bodyHTML = `
    <p>Bonjour ${full_name || 'cher client'},</p>

    <p>Excellente nouvelle ! Votre commande <strong>${displayId}</strong> vient d'être expédiée de nos entrepôts 🚀</p>

    <div style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px; margin:24px 0;">
      <p style="margin:0 0 8px; color:#166534; font-size:14px; font-weight:bold; text-transform:uppercase;">Informations de suivi</p>
      <p style="margin:0; color:#14532d;">
        Transporteur : <strong>${carrier || 'Standard'}</strong><br/>
        Numéro : <strong style="font-family:monospace; font-size:16px;">${tracking_number || 'Non disponible'}</strong>
      </p>
    </div>

    <p style="margin-bottom:8px;">Contenu du colis :</p>
    <ul style="color:#475569; padding-left:20px; margin-top:0;">
      ${itemsList}
    </ul>

    <p>Vous pouvez suivre l’acheminement de votre colis en temps réel en cliquant ci-dessous.</p>
  `

  return baseEmailTemplate({
    title: 'Votre colis est en route ! 📦',
    bodyHTML,
    ctaLabel: 'Suivre mon colis',
    // Utilise l'URL fournie ou génère une URL La Poste par défaut
    ctaUrl:
      tracking_url ||
      (tracking_number
        ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking_number}`
        : `https://fast-peptides.com/profil/commandes/${order_id}`),
  })
}
