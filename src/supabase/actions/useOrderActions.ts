import { useDialog } from '@/features/interface/dialog'
import { deleteOrderById, updateOrderStatusInDB } from '@/supabase/api/ordersApi'
import type { OrderStatus } from '@/utils' // Ton helper V2
import { sanitizeHTML } from '@/utils/sanitize'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

// Type minimaliste qui accepte Vue ou Table
type MinimalOrder = {
  order_id?: string | null
  id?: string | null
  order_number?: string | null
}

export function useOrderActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  // 🗑️ SUPPRESSION V2
  async function deleteOrder(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    const safeId = sanitizeHTML(order.order_number || id)

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer cette commande ?',
      message: [
        `<p class="mb-2">Voulez-vous vraiment supprimer la commande <strong>${safeId}</strong> ?</p>`,
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

  // 🔄 STATUT V2 (RPC Only)
  async function changeOrderStatus(order: MinimalOrder, status: OrderStatus) {
    const id = order.order_id ?? order.id
    if (!id) return

    try {
      // RPC : Met à jour statut + Log email
      await updateOrderStatusInDB(id, status)

      // Note: Pas besoin d'appeler send-order-update ici, la RPC log l'email
      // et ton trigger DB ou webhook devrait gérer l'envoi.

      toast.show(`Statut mis à jour : ${status}`, 'success')
      fetchData?.()
    } catch (err: any) {
      console.error(err)
      toast.show(`Erreur statut : ${err.message}`, 'danger')
    }
  }

  return { deleteOrder, changeOrderStatus }
}
