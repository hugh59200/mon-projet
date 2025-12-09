// API Crypto Matching - V6.9
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import { handleApi } from '@/api/helpers/handleError'
import type { OrderStatus } from '@/utils'

// ============================================================
// TYPES
// ============================================================

export type CryptoType = 'BTC' | 'USDT_TRC20' | 'ETH' | 'USDT_ERC20'

export interface CryptoVerificationResult {
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

export interface CryptoOrderForMatching {
  order_id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  payment_method: string
  crypto_txid: string | null
  crypto_type: string | null
  crypto_verified_at: string | null
  crypto_verified_amount: number | null
  created_at: string
  status: OrderStatus
}

export interface SaveCryptoVerificationResult {
  success: boolean
  order_id: string
  txid: string
  crypto_type: string
  verified_at: string
}

// ============================================================
// FETCH CRYPTO ORDERS
// ============================================================

/**
 * Recupere les commandes crypto en attente de paiement
 */
export async function fetchCryptoPendingOrders(): Promise<CryptoOrderForMatching[]> {
  const res = await supabase
    .from('orders_overview_for_admin')
    .select('*')
    .eq('status', 'pending')
    .eq('payment_method', 'crypto')
    .order('created_at', { ascending: false })

  // Cast via unknown car les types Supabase ne contiennent pas encore les champs crypto
  return handleApi(res) as unknown as CryptoOrderForMatching[]
}

/**
 * Recupere toutes les commandes crypto (tous statuts)
 */
export async function fetchAllCryptoOrders(): Promise<CryptoOrderForMatching[]> {
  const res = await supabase
    .from('orders_overview_for_admin')
    .select('*')
    .eq('payment_method', 'crypto')
    .order('created_at', { ascending: false })

  // Cast via unknown car les types Supabase ne contiennent pas encore les champs crypto
  return handleApi(res) as unknown as CryptoOrderForMatching[]
}

// ============================================================
// VERIFICATION BLOCKCHAIN
// ============================================================

/**
 * Verifie une transaction crypto via l'Edge Function
 */
export async function verifyCryptoTransaction(
  txid: string,
  cryptoType: CryptoType,
): Promise<CryptoVerificationResult> {
  const { data, error } = await supabase.functions.invoke('verify-crypto-transaction', {
    body: { txid, crypto_type: cryptoType },
  })

  if (error) {
    throw new Error(error.message || 'Erreur lors de la verification blockchain')
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Verification echouee')
  }

  return data.data as CryptoVerificationResult
}

// ============================================================
// SAUVEGARDE VERIFICATION
// ============================================================

/**
 * Sauvegarde la verification crypto en base de donnees
 */
export async function saveCryptoVerification(
  orderId: string,
  txid: string,
  cryptoType: CryptoType,
  verifiedAmount: number,
): Promise<SaveCryptoVerificationResult> {
  // Cast necessaire car la RPC n'est pas encore dans les types generes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (supabase.rpc as any)('admin_save_crypto_verification', {
    p_order_id: orderId,
    p_txid: txid,
    p_crypto_type: cryptoType,
    p_verified_amount: verifiedAmount,
  })

  const result = handleApi(res)
  return result as unknown as SaveCryptoVerificationResult
}

// ============================================================
// VALIDATION PAIEMENT
// ============================================================

/**
 * Valide le paiement crypto (change le statut en 'paid')
 */
export async function validateCryptoPayment(orderId: string): Promise<void> {
  const res = await supabase.rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_new_status: 'paid',
    p_send_email: true,
  })

  handleApi(res)
}

/**
 * Valide le paiement et sauvegarde le TXID en une seule operation
 */
export async function verifySaveAndValidate(
  orderId: string,
  txid: string,
  cryptoType: CryptoType,
): Promise<CryptoVerificationResult> {
  // 1. Verifier sur la blockchain
  const verification = await verifyCryptoTransaction(txid, cryptoType)

  if (!verification.valid) {
    throw new Error('Transaction invalide ou montant non trouve')
  }

  // 2. Sauvegarder le TXID
  await saveCryptoVerification(orderId, txid, cryptoType, verification.amount)

  // 3. Valider le paiement
  await validateCryptoPayment(orderId)

  return verification
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Retourne l'URL de l'explorateur blockchain pour un TXID
 */
export function getBlockExplorerUrl(txid: string, cryptoType: CryptoType): string {
  switch (cryptoType) {
    case 'BTC':
      return `https://blockstream.info/tx/${txid}`
    case 'USDT_TRC20':
      return `https://tronscan.org/#/transaction/${txid}`
    case 'ETH':
    case 'USDT_ERC20':
      return `https://etherscan.io/tx/${txid}`
    default:
      return '#'
  }
}

/**
 * Retourne le libelle d'un type de crypto
 */
export function getCryptoLabel(cryptoType: CryptoType): string {
  switch (cryptoType) {
    case 'BTC':
      return 'Bitcoin (BTC)'
    case 'USDT_TRC20':
      return 'USDT (TRC20)'
    case 'ETH':
      return 'Ethereum (ETH)'
    case 'USDT_ERC20':
      return 'USDT (ERC20)'
    default:
      return cryptoType
  }
}

/**
 * Retourne l'icone pour un type de crypto
 */
export function getCryptoIcon(cryptoType: CryptoType): string {
  switch (cryptoType) {
    case 'BTC':
      return 'Bitcoin'
    case 'USDT_TRC20':
    case 'USDT_ERC20':
      return 'DollarSign'
    case 'ETH':
      return 'Hexagon'
    default:
      return 'Coins'
  }
}
