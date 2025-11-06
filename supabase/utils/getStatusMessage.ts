// utils/getStatusMessage.ts

export function getStatusMessage(status: string, carrier?: string, tracking_number?: string) {
  const lower = status.toLowerCase()

  switch (lower) {
    case 'pending':
      return 'Votre commande est en attente de traitement. Nous la préparerons très bientôt. 🕓'
    case 'confirmed':
      return 'Votre commande a bien été confirmée ✅. Elle sera bientôt préparée.'
    case 'processing':
      return 'Votre commande est en cours de préparation dans nos laboratoires. 🧪'
    case 'shipped': {
      let trackingInfo = ''
      if (carrier || tracking_number) {
        const link =
          tracking_number && tracking_number.startsWith('http')
            ? `<a href="${tracking_number}" target="_blank">${tracking_number}</a>`
            : tracking_number || ''
        trackingInfo = `
          <div style="margin-top:10px;">
            ${carrier ? `<p><b>Transporteur :</b> ${carrier}</p>` : ''}
            ${tracking_number ? `<p><b>Numéro / lien de suivi :</b> ${link}</p>` : ''}
          </div>
        `
      }
      return `Votre commande a été expédiée 🚚. Vous la recevrez très prochainement.${trackingInfo}`
    }
    case 'completed':
      return 'Votre commande a été livrée avec succès 🎉. Merci de votre confiance !'
    case 'canceled':
      return "Votre commande a été annulée ❌. Si vous pensez qu'il s'agit d'une erreur, contactez notre support."
    default:
      return `Le statut de votre commande a été mis à jour : <b>${status}</b>`
  }
}
