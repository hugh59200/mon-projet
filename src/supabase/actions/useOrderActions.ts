// useOrderActions.ts — V3.2 (Relay Support)
import { useDialog } from '@/features/interface/dialog'
import { 
  deleteOrderById, 
  updateOrderStatusInDB,
  getDeliveryAddress,
  isRelayDelivery 
} from '@/supabase/api/ordersApi'
import type { OrderStatus } from '@/utils'
import { sanitizeHTML } from '@/utils/sanitize'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { supabase } from '../supabaseClient'

// Type minimaliste qui accepte Vue ou Table
type MinimalOrder = {
  order_id?: string | null
  id?: string | null
  order_number?: string | null
  is_guest_order?: boolean | null
  customer_email?: string | null
  // 🆕 Champs relay
  relay_id?: string | null
  relay_name?: string | null
  relay_city?: string | null
  is_relay_delivery?: boolean | null
}

export function useOrderActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  // 🗑️ SUPPRESSION V3.2 (Guest-aware + Relay info)
  async function deleteOrder(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    const safeId = sanitizeHTML(order.order_number || id)
    const isGuest = order.is_guest_order ?? false
    const isRelay = order.is_relay_delivery ?? !!order.relay_id

    const guestEmail = order.customer_email
      ? `<br/><span class="text-sm text-neutral-600">(${sanitizeHTML(order.customer_email)})</span>`
      : ''

    // 🆕 Info point relais
    const relayInfo = isRelay && order.relay_name
      ? `<p class="text-sm text-green-600 mb-2">📍 Point Relais : ${sanitizeHTML(order.relay_name)}</p>`
      : ''

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer cette commande ?',
      message: [
        `<p class="mb-2">Voulez-vous vraiment supprimer la commande <strong>${safeId}</strong> ?</p>`,
        isGuest ? `<p class="text-sm text-info-600 mb-2">👤 Commande invité${guestEmail}</p>` : '',
        relayInfo,
        `<p class="text-sm text-red-600">Cette action est irréversible.</p>`,
      ],
      isHtml: true,
      closable: false,
    })

    if (result !== 'Yes') return

    try {
      await deleteOrderById(id)
      toast.show('Commande supprimée ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      console.error(err)
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  // 🔄 STATUT V3.2 (RPC + Email avec tracking token)
  async function changeOrderStatus(order: MinimalOrder, status: OrderStatus) {
    const id = order.order_id ?? order.id
    if (!id) return

    try {
      // 1. RPC : Met à jour statut + shipped_at si "shipped"
      await updateOrderStatusInDB(id, status)

      // 2. EDGE FUNCTION : Envoie l'email au client avec lien de tracking
      try {
        await supabase.functions.invoke('send-order-update', {
          body: { order_id: id, status },
        })
        console.log('✅ Email de mise à jour envoyé')
      } catch (emailErr) {
        console.warn('⚠️ Erreur envoi email (non bloquant):', emailErr)
      }

      toast.show(`Statut mis à jour : ${status} 📧`, 'success')
      fetchData?.()
    } catch (err: any) {
      console.error(err)
      toast.show(`Erreur statut : ${err.message}`, 'danger')
    }
  }

  // 🆕 FONCTION UTILITAIRE : Récupérer le lien de tracking
  async function getOrderTrackingLink(orderId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('get_order_summary_public', {
        p_order_id: orderId,
      })

      if (error || !data) return null

      const order = data as any
      const isGuest = !order.user_id

      if (isGuest && order.tracking_token) {
        return `${window.location.origin}/suivi-commande?token=${order.tracking_token}`
      } else if (!isGuest) {
        return `${window.location.origin}/profil/commandes/${orderId}`
      }

      return null
    } catch (err) {
      console.error('Erreur récupération tracking link:', err)
      return null
    }
  }

  // 🆕 COPIER LE LIEN DE TRACKING
  async function copyTrackingLink(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    const link = await getOrderTrackingLink(id)
    if (!link) {
      toast.show('Lien de tracking indisponible', 'warning')
      return
    }

    try {
      await navigator.clipboard.writeText(link)
      toast.show('Lien de tracking copié ! 📋', 'success')
    } catch (err) {
      console.error('Erreur copie:', err)
      toast.show('Impossible de copier le lien', 'danger')
    }
  }

  // 🆕 AFFICHER LES DÉTAILS DE LIVRAISON
  async function showDeliveryDetails(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('orders_full_view')
        .select('*')
        .eq('order_id', id)
        .single()

      if (error || !data) {
        toast.show('Impossible de charger les détails', 'danger')
        return
      }

      const delivery = getDeliveryAddress(data)
      if (!delivery) return

      const title = delivery.isRelay ? '📍 Point Relais' : '🏠 Livraison à domicile'
      
      await showDialog({
        type: 'Ok',
        title,
        message: [
          `<div class="space-y-2">`,
          `<p class="font-semibold">${sanitizeHTML(delivery.name)}</p>`,
          `<p>${sanitizeHTML(delivery.address)}</p>`,
          `<p>${sanitizeHTML(delivery.zip)} ${sanitizeHTML(delivery.city)}</p>`,
          `<p>${sanitizeHTML(delivery.country)}</p>`,
          delivery.isRelay 
            ? `<p class="text-sm text-green-600 mt-4">✅ Livraison gratuite en Point Relais</p>` 
            : '',
          `</div>`,
        ],
        isHtml: true,
      })
    } catch (err) {
      console.error(err)
      toast.show('Erreur chargement détails', 'danger')
    }
  }

  return {
    deleteOrder,
    changeOrderStatus,
    getOrderTrackingLink,
    copyTrackingLink,
    showDeliveryDetails, // 🆕
  }
}