// supabase/functions/verify-crypto-transaction/index.ts

import { createHandler } from '../../utils/createHandler.ts'

// Types de crypto supportes
type CryptoType = 'BTC' | 'USDT_TRC20' | 'ETH' | 'USDT_ERC20'

interface VerifyCryptoBody {
  txid: string
  crypto_type: CryptoType
}

interface CryptoVerificationResult {
  valid: boolean
  txid: string
  crypto_type: CryptoType
  amount: number
  amount_formatted: string
  to_address: string
  from_address: string
  timestamp: string
  confirmations: number
  block_explorer_url: string
  error?: string
}

// Configuration des adresses wallet depuis les variables d'environnement
const CRYPTO_ADDRESSES: Record<CryptoType, string> = {
  BTC: Deno.env.get('CRYPTO_BTC_ADDRESS') ?? '',
  USDT_TRC20: Deno.env.get('CRYPTO_USDT_TRC20_ADDRESS') ?? '',
  ETH: Deno.env.get('CRYPTO_ETH_ADDRESS') ?? '',
  USDT_ERC20: Deno.env.get('CRYPTO_ETH_ADDRESS') ?? '', // Meme adresse que ETH
}

// Cle API Etherscan (gratuite)
const ETHERSCAN_API_KEY = Deno.env.get('ETHERSCAN_API_KEY') ?? ''

// URLs des explorers blockchain
const EXPLORER_URLS: Record<CryptoType, (txid: string) => string> = {
  BTC: (txid) => `https://blockstream.info/tx/${txid}`,
  USDT_TRC20: (txid) => `https://tronscan.org/#/transaction/${txid}`,
  ETH: (txid) => `https://etherscan.io/tx/${txid}`,
  USDT_ERC20: (txid) => `https://etherscan.io/tx/${txid}`,
}

/**
 * Verifie une transaction Bitcoin via Blockstream API
 */
async function verifyBTC(txid: string): Promise<CryptoVerificationResult> {
  const url = `https://blockstream.info/api/tx/${txid}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Transaction BTC non trouvee: ${txid}`)
  }

  const tx = await response.json()

  // Chercher la sortie correspondant a notre adresse
  const ourAddress = CRYPTO_ADDRESSES.BTC.toLowerCase()
  let amount = 0
  let toAddress = ''

  for (const vout of tx.vout) {
    if (vout.scriptpubkey_address?.toLowerCase() === ourAddress) {
      amount += vout.value // En satoshis
      toAddress = vout.scriptpubkey_address
    }
  }

  // Convertir satoshis en BTC
  const amountBTC = amount / 100_000_000

  // Recuperer le nombre de confirmations
  const statusResponse = await fetch(`https://blockstream.info/api/tx/${txid}/status`)
  const status = await statusResponse.json()

  return {
    valid: amount > 0,
    txid,
    crypto_type: 'BTC',
    amount: amountBTC,
    amount_formatted: `${amountBTC.toFixed(8)} BTC`,
    to_address: toAddress || 'Non trouve',
    from_address: tx.vin?.[0]?.prevout?.scriptpubkey_address || 'N/A',
    timestamp: tx.status?.block_time
      ? new Date(tx.status.block_time * 1000).toISOString()
      : new Date().toISOString(),
    confirmations: status.confirmed ? status.block_height : 0,
    block_explorer_url: EXPLORER_URLS.BTC(txid),
  }
}

/**
 * Verifie une transaction USDT TRC20 via TronScan API
 */
async function verifyUSDT_TRC20(txid: string): Promise<CryptoVerificationResult> {
  const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${txid}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Transaction TRC20 non trouvee: ${txid}`)
  }

  const data = await response.json()

  if (!data || data.contractRet !== 'SUCCESS') {
    throw new Error(`Transaction TRC20 echouee ou non trouvee: ${txid}`)
  }

  // Pour les transferts TRC20, verifier le token_transfer_info
  const ourAddress = CRYPTO_ADDRESSES.USDT_TRC20
  let amount = 0
  let toAddress = ''
  let fromAddress = ''

  // Chercher dans trc20TransferInfo pour les transferts USDT
  if (data.trc20TransferInfo && data.trc20TransferInfo.length > 0) {
    for (const transfer of data.trc20TransferInfo) {
      // USDT TRC20 contract: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
      if (transfer.to_address === ourAddress) {
        // Le montant est en format decimal avec 6 decimales pour USDT
        amount = parseFloat(transfer.amount_str) / 1_000_000
        toAddress = transfer.to_address
        fromAddress = transfer.from_address
        break
      }
    }
  }

  // Confirmations sur Tron (bloc confirme apres ~19 blocs)
  const confirmations = data.confirmed ? 19 : 0

  return {
    valid: amount > 0,
    txid,
    crypto_type: 'USDT_TRC20',
    amount,
    amount_formatted: `${amount.toFixed(2)} USDT`,
    to_address: toAddress || 'Non trouve',
    from_address: fromAddress || data.ownerAddress || 'N/A',
    timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
    confirmations,
    block_explorer_url: EXPLORER_URLS.USDT_TRC20(txid),
  }
}

/**
 * Verifie une transaction ETH via Etherscan API
 */
async function verifyETH(txid: string): Promise<CryptoVerificationResult> {
  if (!ETHERSCAN_API_KEY) {
    throw new Error('ETHERSCAN_API_KEY non configure')
  }

  const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txid}&apikey=${ETHERSCAN_API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Erreur API Etherscan: ${response.status}`)
  }

  const data = await response.json()

  if (!data.result || data.result === null) {
    throw new Error(`Transaction ETH non trouvee: ${txid}`)
  }

  const tx = data.result
  const ourAddress = CRYPTO_ADDRESSES.ETH.toLowerCase()
  const toAddress = tx.to?.toLowerCase() || ''

  // Convertir la valeur hex en ETH
  const valueWei = parseInt(tx.value, 16)
  const amountETH = valueWei / 1e18

  // Verifier que la transaction est destinee a notre adresse
  const isOurs = toAddress === ourAddress

  // Recuperer le receipt pour les confirmations
  const receiptUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txid}&apikey=${ETHERSCAN_API_KEY}`
  const receiptResponse = await fetch(receiptUrl)
  const receiptData = await receiptResponse.json()

  // Recuperer le bloc actuel pour calculer les confirmations
  const blockUrl = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
  const blockResponse = await fetch(blockUrl)
  const blockData = await blockResponse.json()

  const currentBlock = parseInt(blockData.result, 16)
  const txBlock = parseInt(tx.blockNumber, 16)
  const confirmations = currentBlock - txBlock

  return {
    valid: isOurs && amountETH > 0,
    txid,
    crypto_type: 'ETH',
    amount: amountETH,
    amount_formatted: `${amountETH.toFixed(6)} ETH`,
    to_address: tx.to || 'Non trouve',
    from_address: tx.from || 'N/A',
    timestamp: new Date().toISOString(), // Etherscan ne retourne pas le timestamp facilement
    confirmations,
    block_explorer_url: EXPLORER_URLS.ETH(txid),
  }
}

/**
 * Verifie une transaction USDT ERC20 via Etherscan API
 */
async function verifyUSDT_ERC20(txid: string): Promise<CryptoVerificationResult> {
  if (!ETHERSCAN_API_KEY) {
    throw new Error('ETHERSCAN_API_KEY non configure')
  }

  // Recuperer les transferts de tokens pour cette transaction
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&txhash=${txid}&apikey=${ETHERSCAN_API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Erreur API Etherscan: ${response.status}`)
  }

  const data = await response.json()

  if (!data.result || data.result.length === 0) {
    throw new Error(`Transaction USDT ERC20 non trouvee: ${txid}`)
  }

  const ourAddress = CRYPTO_ADDRESSES.USDT_ERC20.toLowerCase()
  let amount = 0
  let toAddress = ''
  let fromAddress = ''
  let confirmations = 0
  let timestamp = ''

  // USDT ERC20 contract: 0xdAC17F958D2ee523a2206206994597C13D831ec7
  const USDT_CONTRACT = '0xdac17f958d2ee523a2206206994597c13d831ec7'

  for (const transfer of data.result) {
    if (
      transfer.contractAddress?.toLowerCase() === USDT_CONTRACT &&
      transfer.to?.toLowerCase() === ourAddress
    ) {
      // USDT a 6 decimales
      amount = parseFloat(transfer.value) / 1_000_000
      toAddress = transfer.to
      fromAddress = transfer.from
      confirmations = parseInt(transfer.confirmations) || 0
      timestamp = transfer.timeStamp
        ? new Date(parseInt(transfer.timeStamp) * 1000).toISOString()
        : new Date().toISOString()
      break
    }
  }

  return {
    valid: amount > 0,
    txid,
    crypto_type: 'USDT_ERC20',
    amount,
    amount_formatted: `${amount.toFixed(2)} USDT`,
    to_address: toAddress || 'Non trouve',
    from_address: fromAddress || 'N/A',
    timestamp,
    confirmations,
    block_explorer_url: EXPLORER_URLS.USDT_ERC20(txid),
  }
}

/**
 * Handler principal
 */
Deno.serve(
  createHandler<VerifyCryptoBody>(async (_req, body) => {
    const { txid, crypto_type } = body

    if (!txid || !crypto_type) {
      throw new Error('txid et crypto_type sont requis')
    }

    // Valider le type de crypto
    const validTypes: CryptoType[] = ['BTC', 'USDT_TRC20', 'ETH', 'USDT_ERC20']
    if (!validTypes.includes(crypto_type)) {
      throw new Error(`Type de crypto invalide: ${crypto_type}`)
    }

    console.log(`🔍 Verification ${crypto_type} - TXID: ${txid}`)

    // Appeler la fonction de verification appropriee
    let result: CryptoVerificationResult

    switch (crypto_type) {
      case 'BTC':
        result = await verifyBTC(txid)
        break
      case 'USDT_TRC20':
        result = await verifyUSDT_TRC20(txid)
        break
      case 'ETH':
        result = await verifyETH(txid)
        break
      case 'USDT_ERC20':
        result = await verifyUSDT_ERC20(txid)
        break
      default:
        throw new Error(`Type de crypto non supporte: ${crypto_type}`)
    }

    console.log(`✅ Verification terminee:`, {
      valid: result.valid,
      amount: result.amount_formatted,
      confirmations: result.confirmations,
    })

    return result
  }),
)
