import { deleteOrderById, updateOrderStatusInDB } from '@/supabase/api/ordersApi'
import type { Orders, OrderStatus } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

export function useOrderActions(fetchData?: () => void) {
  const toast = useToastStore()

  async function deleteOrder(order: Orders) {
    if (!confirm(`Supprimer la commande #${order.id} ?`)) return
    try {
      await deleteOrderById(order.id)
      toast.show('Commande supprimée ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  async function changeOrderStatus(order: Orders, status: OrderStatus) {
    try {
      const updated = await updateOrderStatusInDB(order.id, status)

      // Optionnel : notif email via edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      await fetch(`${supabaseUrl}/functions/v1/order-status-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          order_id: order.id,
          status,
          email: updated.email,
          full_name: updated.full_name,
        }),
      })

      toast.show('Statut mis à jour ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur statut : ${err.message}`, 'danger')
    }
  }

  return { deleteOrder, changeOrderStatus }
}
