import { ref, computed } from 'vue'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import {
  fetchCryptoPendingOrders,
  fetchAllCryptoOrders,
  verifyCryptoTransaction,
  saveCryptoVerification,
  validateCryptoPayment,
  getBlockExplorerUrl,
  getCryptoLabel,
  type CryptoType,
  type CryptoOrderForMatching,
  type CryptoVerificationResult,
} from '@/api'

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error'
type FilterStatus = 'pending' | 'all'

export function useCryptoMatching() {
  const toast = useToastStore()

  // State
  const orders = ref<CryptoOrderForMatching[]>([])
  const loading = ref(false)
  const hasLoaded = ref(false)
  const filterStatus = ref<FilterStatus>('pending')

  // Verification state (par order_id)
  const verificationStates = ref<
    Record<
      string,
      {
        status: VerificationStatus
        txid: string
        cryptoType: CryptoType
        result: CryptoVerificationResult | null
        error: string | null
      }
    >
  >({})

  // Computed
  const pendingCount = computed(() => orders.value.filter((o) => o.status === 'pending').length)

  const verifiedCount = computed(
    () => orders.value.filter((o) => o.crypto_txid !== null).length,
  )

  // Actions
  async function fetchOrders() {
    loading.value = true
    try {
      orders.value =
        filterStatus.value === 'pending'
          ? await fetchCryptoPendingOrders()
          : await fetchAllCryptoOrders()
      hasLoaded.value = true
    } catch (error) {
      toast.show('Erreur lors du chargement des commandes', 'danger')
      console.error('fetchOrders error:', error)
    } finally {
      loading.value = false
    }
  }

  function initVerification(orderId: string) {
    if (!verificationStates.value[orderId]) {
      verificationStates.value[orderId] = {
        status: 'idle',
        txid: '',
        cryptoType: 'BTC',
        result: null,
        error: null,
      }
    }
  }

  function updateTxid(orderId: string, txid: string) {
    initVerification(orderId)
    verificationStates.value[orderId]!.txid = txid
  }

  function updateCryptoType(orderId: string, cryptoType: CryptoType) {
    initVerification(orderId)
    verificationStates.value[orderId]!.cryptoType = cryptoType
  }

  async function verifyTransaction(orderId: string) {
    const state = verificationStates.value[orderId]
    if (!state || !state.txid) {
      toast.show('Veuillez entrer un TXID', 'danger')
      return
    }

    state.status = 'verifying'
    state.error = null
    state.result = null

    try {
      const result = await verifyCryptoTransaction(state.txid, state.cryptoType)
      state.result = result
      state.status = result.valid ? 'success' : 'error'

      if (!result.valid) {
        state.error = 'Transaction non trouvee ou montant invalide'
        toast.show('Transaction non valide', 'danger')
      } else {
        toast.show(`Transaction verifiee: ${result.amount_formatted}`, 'success')
      }
    } catch (error) {
      state.status = 'error'
      state.error = error instanceof Error ? error.message : 'Erreur de verification'
      toast.show(state.error, 'danger')
    }
  }

  async function saveAndValidatePayment(orderId: string) {
    const state = verificationStates.value[orderId]
    if (!state || !state.result || !state.result.valid) {
      toast.show('Veuillez d\'abord verifier la transaction', 'danger')
      return
    }

    try {
      // Sauvegarder le TXID
      await saveCryptoVerification(
        orderId,
        state.txid,
        state.cryptoType,
        state.result.amount,
      )

      // Valider le paiement
      await validateCryptoPayment(orderId)

      toast.show('Paiement valide avec succes', 'success')

      // Rafraichir la liste
      await fetchOrders()
    } catch (error) {
      toast.show(
        error instanceof Error ? error.message : 'Erreur lors de la validation',
        'danger',
      )
    }
  }

  function resetVerification(orderId: string) {
    delete verificationStates.value[orderId]
  }

  function getVerificationState(orderId: string) {
    return (
      verificationStates.value[orderId] || {
        status: 'idle' as VerificationStatus,
        txid: '',
        cryptoType: 'BTC' as CryptoType,
        result: null,
        error: null,
      }
    )
  }

  function setFilterStatus(status: FilterStatus) {
    filterStatus.value = status
    fetchOrders()
  }

  return {
    // State
    orders,
    loading,
    hasLoaded,
    filterStatus,
    pendingCount,
    verifiedCount,

    // Actions
    fetchOrders,
    verifyTransaction,
    saveAndValidatePayment,
    resetVerification,
    setFilterStatus,

    // Verification state helpers
    initVerification,
    updateTxid,
    updateCryptoType,
    getVerificationState,

    // Utils
    getBlockExplorerUrl,
    getCryptoLabel,
  }
}
