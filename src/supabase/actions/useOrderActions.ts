import { useDialog } from '@/features/interface/dialog'
import { deleteOrderById, updateOrderStatusInDB } from '@/supabase/api/ordersApi'
import type { OrderStatus } from '@/utils'
import { sanitizeHTML } from '@/utils/sanitize'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

type MinimalOrder = {
  order_id?: string | null
  id?: string | null
  order_number?: string | null
}

export function useOrderActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  async function deleteOrder(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    const safeId = sanitizeHTML(id)

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer cette commande ?',
      message: [
        `
        <p style="margin:0 0 12px;">
          Voulez-vous vraiment supprimer cette commande ?
        </p>

        <p style="margin:0 0 12px;">
          <strong>Commande :</strong> #${safeId}
        </p>

        <p style="margin:0;">
          <strong>Confirmez-vous ?</strong>
        </p>
      `,
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
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  async function changeOrderStatus(order: MinimalOrder, status: OrderStatus) {
    const id = order.order_id ?? order.id
    if (!id) return

    try {
      await updateOrderStatusInDB(id, status)

      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ order_id: id, status }),
      })

      toast.show('Statut mis à jour ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur statut : ${err.message}`, 'danger')
    }
  }

  return { deleteOrder, changeOrderStatus }
}
