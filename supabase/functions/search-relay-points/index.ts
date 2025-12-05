// supabase/functions/search-relay-points/index.ts

import { createHandler } from '../../utils/createHandler.ts'

// Configuration Mondial Relay depuis les variables d'environnement
const MR_ENSEIGNE = Deno.env.get('MONDIAL_RELAY_ENSEIGNE') ?? 'BDTEST'
const MR_PRIVATE_KEY = Deno.env.get('MONDIAL_RELAY_PRIVATE_KEY') ?? 'PrivateK'

// URL de l'API SOAP Mondial Relay
const MR_API_URL = 'https://api.mondialrelay.com/Web_Services.asmx'

interface SearchRelayBody {
  postcode: string
  country?: string
  city?: string
  nbResults?: number
  weight?: number
}

interface RelayPoint {
  id: string
  name: string
  address: string
  address2?: string
  zipCode: string
  city: string
  country: string
  latitude: number
  longitude: number
  distance?: number
  openingHours?: Record<string, string>
}

/**
 * Calcule le hash MD5 pour l'authentification Mondial Relay
 */
async function md5(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('MD5', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Construit la requête SOAP pour l'API Mondial Relay
 */
function buildSoapRequest(params: {
  enseigne: string
  pays: string
  cp: string
  ville: string
  nbResults: number
  security: string
}): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${params.enseigne}</Enseigne>
      <Pays>${params.pays}</Pays>
      <Ville>${params.ville}</Ville>
      <CP>${params.cp}</CP>
      <Latitude></Latitude>
      <Longitude></Longitude>
      <Taille></Taille>
      <Poids></Poids>
      <Action></Action>
      <DelaiEnvoi>0</DelaiEnvoi>
      <RayonRecherche></RayonRecherche>
      <TypeActivite></TypeActivite>
      <NACE></NACE>
      <NombreResultats>${params.nbResults}</NombreResultats>
      <Security>${params.security}</Security>
    </WSI4_PointRelais_Recherche>
  </soap:Body>
</soap:Envelope>`
}

/**
 * Parse la réponse XML de Mondial Relay
 */
function parseRelayPoints(xml: string): RelayPoint[] {
  const points: RelayPoint[] = []

  // Regex pour extraire chaque PointRelais_Details
  const pointRegex = /<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g
  let match

  while ((match = pointRegex.exec(xml)) !== null) {
    const block = match[1]

    // Helper pour extraire une valeur
    const getValue = (tag: string): string => {
      const tagMatch = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))
      return tagMatch ? tagMatch[1].trim() : ''
    }

    const num = getValue('Num')
    if (!num) continue

    // Parser les horaires
    const openingHours: Record<string, string> = {}
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    days.forEach((day, idx) => {
      const dayNum = String(idx + 1).padStart(2, '0')
      const horaires = getValue(`Horaires_${day}`)
      if (horaires && horaires !== '0000 0000 0000 0000') {
        // Format: "0900 1200 1400 1900" -> "09:00-12:00 / 14:00-19:00"
        const parts = horaires.split(' ').filter((p) => p !== '0000')
        if (parts.length >= 2) {
          const formatted = []
          for (let i = 0; i < parts.length; i += 2) {
            if (parts[i] && parts[i + 1]) {
              formatted.push(
                `${parts[i].slice(0, 2)}:${parts[i].slice(2)}-${parts[i + 1].slice(0, 2)}:${parts[i + 1].slice(2)}`,
              )
            }
          }
          if (formatted.length) {
            openingHours[day] = formatted.join(' / ')
          }
        }
      }
    })

    points.push({
      id: `${getValue('Pays')}-${num}`,
      name: getValue('LgAdr1'),
      address: getValue('LgAdr3'),
      address2: getValue('LgAdr4') || undefined,
      zipCode: getValue('CP'),
      city: getValue('Ville'),
      country: getValue('Pays'),
      latitude: parseFloat(getValue('Latitude').replace(',', '.')) || 0,
      longitude: parseFloat(getValue('Longitude').replace(',', '.')) || 0,
      distance: parseInt(getValue('Distance')) || undefined,
      openingHours: Object.keys(openingHours).length ? openingHours : undefined,
    })
  }

  return points
}

/**
 * Vérifie le code de retour Mondial Relay
 */
function checkMRError(xml: string): void {
  const statMatch = xml.match(/<STAT>([^<]*)<\/STAT>/)
  const stat = statMatch ? statMatch[1].trim() : ''

  if (stat && stat !== '0') {
    const errors: Record<string, string> = {
      '1': 'Enseigne invalide',
      '2': 'Numéro enseigne vide ou inexistant',
      '3': 'Compte enseigne non actif',
      '8': 'Code postal invalide',
      '9': 'Pays invalide',
      '10': 'Poids invalide',
      '11': 'Taille invalide',
      '12': 'Délai envoi invalide',
      '24': 'Aucun point relais trouvé',
      '80': 'Code tracing vide',
      '81': 'Code tracing invalide',
      '97': 'Clé de sécurité invalide',
    }
    throw new Error(errors[stat] || `Erreur Mondial Relay: ${stat}`)
  }
}

Deno.serve(
  createHandler<SearchRelayBody>(async (_req, body) => {
    const { postcode, country = 'FR', city = '', nbResults = 10 } = body

    if (!postcode || postcode.length < 4) {
      throw new Error('Code postal requis (min 4 caractères)')
    }

    console.log(`🔍 Recherche points relais: ${postcode} (${country})`)

    // Construction de la chaîne pour le hash de sécurité
    // L'ordre est crucial : Enseigne + Pays + Ville + CP + Latitude + Longitude + Taille + Poids + Action + DelaiEnvoi + RayonRecherche + TypeActivite + NACE + NombreResultats + PrivateKey
    const securityString = [
      MR_ENSEIGNE,
      country,
      city,
      postcode,
      '', // Latitude
      '', // Longitude
      '', // Taille
      '', // Poids
      '', // Action
      '0', // DelaiEnvoi
      '', // RayonRecherche
      '', // TypeActivite
      '', // NACE
      String(nbResults),
      MR_PRIVATE_KEY,
    ].join('')

    const security = await md5(securityString)

    // Construction de la requête SOAP
    const soapRequest = buildSoapRequest({
      enseigne: MR_ENSEIGNE,
      pays: country,
      cp: postcode,
      ville: city,
      nbResults,
      security,
    })

    console.log('📤 Appel API Mondial Relay...')

    // Appel à l'API Mondial Relay
    const response = await fetch(MR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'http://www.mondialrelay.fr/webservice/WSI4_PointRelais_Recherche',
      },
      body: soapRequest,
    })

    if (!response.ok) {
      throw new Error(`Erreur API Mondial Relay: ${response.status}`)
    }

    const xml = await response.text()

    // Vérification des erreurs
    checkMRError(xml)

    // Parsing des résultats
    const points = parseRelayPoints(xml)

    return {
      points,
      count: points.length,
      postcode,
      country,
    }
  }),
)
