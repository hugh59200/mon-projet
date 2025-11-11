import { deleteOrderById, updateOrderStatusInDB } from '@/supabase/api/ordersApi'
import type { OrderStatus } from '@/utils'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

type MinimalOrder = {
  order_id?: string | null
  id?: string | null
}

export function useOrderActions(fetchData?: () => void) {
  const toast = useToastStore()

  async function deleteOrder(order: MinimalOrder) {
    const id = order.order_id ?? order.id
    if (!id) return

    if (!confirm(`Supprimer la commande #${id} ?`)) return
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
      console.log('invoking...')
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
