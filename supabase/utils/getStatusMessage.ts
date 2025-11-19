export function getStatusMessage(status: string, carrier?: string, tracking_number?: string) {
  const lower = status.toLowerCase()

  switch (lower) {
    case 'pending':
      return 'Elle est en attente de traitement. Nous la préparerons très bientôt. 🕓'

    case 'confirmed':
      return 'Elle a bien été confirmée ✅ et sera bientôt préparée.'

    case 'processing':
      return 'Elle est actuellement en cours de préparation dans nos laboratoires. 🧪'

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
      return `Elle a été expédiée 🚚. Vous la recevrez très prochainement.${trackingInfo}`
    }

    case 'completed':
      return 'Elle a été livrée avec succès 🎉. Merci de votre confiance !'

    case 'canceled':
      return "Elle a été annulée ❌. Si vous pensez qu'il s'agit d'une erreur, contactez notre support."

    default:
      return `Son statut a été mis à jour : <b>${status}</b>`
  }
}
