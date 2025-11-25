import type { OrderStatus } from '../../utils'
import { supabase } from '../supabaseClient'
import type { Json } from '../types/supabase'
import type { OrdersFullView } from '../types/supabase.types'
import { handleApi, handleMutation } from './helpers/HandleError'

// Type spécifique pour la création (ne vient pas de la DB directement)
export type CreateOrderPayload = {
  // ✅ On garde le type correct ici pour ton code à toi
  userId: string | null
  email: string
  fullName: string
  address: string
  zip: string
  city: string
  country: string
  paymentMethod: string
  subtotal: number
  taxAmount: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  items: {
    product_id: string
    quantity: number
    product_price: number
  }[]
}

/** ✅ CRÉATION V3.0 (Guest Compatible) */
export async function createOrder(payload: CreateOrderPayload): Promise<OrdersFullView> {
  // Conversion explicite des items en Json
  const itemsJson = payload.items as unknown as Json

  const res = await supabase.rpc('create_order_with_items_full', {
    // 🛠️ FIX SANS TOUCHER AUX TYPES GÉNÉRÉS :
    // On force TypeScript à accepter la valeur, car on sait que la DB (V3.0) accepte NULL à l'exécution.
    // "as any" est ici légitime pour contourner un décalage de génération de types.
    p_user_id: payload.userId as any,

    p_email: payload.email,
    p_full_name: payload.fullName,
    p_address: payload.address,
    p_zip: payload.zip,
    p_city: payload.city,
    p_country: payload.country,
    p_payment_method: payload.paymentMethod,

    p_subtotal: payload.subtotal,
    p_tax_amount: payload.taxAmount,
    p_shipping_cost: payload.shippingCost,
    p_discount_amount: payload.discountAmount,
    p_total_amount: payload.totalAmount,

    p_items: itemsJson,
  })

  const result = handleApi(res)

  return result as unknown as OrdersFullView
}

// ... Le reste du fichier reste inchangé (fetchOrders, etc.)
/** ✅ ADMIN : Récupère toutes les commandes */
export async function fetchOrders(): Promise<OrdersFullView[]> {
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .order('created_at', { ascending: false })

  return handleApi(res)
}

/** ✅ USER : Récupère uniquement les commandes de l'utilisateur connecté */
export async function fetchUserOrders(userId: string): Promise<OrdersFullView[]> {
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return handleApi(res)
}

/** ✅ USER/ADMIN : Récupère une commande unique par son ID */
export async function fetchOrderById(orderId: string): Promise<OrdersFullView | null> {
  const res = await supabase.from('orders_full_view').select('*').eq('order_id', orderId).single()

  return handleApi(res)
}

/** ✅ ADMIN : Suppression sécurisée */
export async function deleteOrderById(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  handleMutation(error)
}

export async function trackGuestOrder(email: string, orderNumber: string) {
  const { data, error } = await supabase.rpc('get_guest_order_details', {
    p_email: email,
    p_order_number: orderNumber,
  })

  if (error) throw error

  // Typage manuel du retour JSONB
  const result = data as { found: boolean; message?: string; order?: any }

  if (!result.found) {
    throw new Error(result.message || 'Commande introuvable')
  }

  return result.order
}

/** ✅ ADMIN : Mise à jour du statut via RPC */
export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_new_status: status,
    p_send_email: true,
  })

  handleMutation(error)
  return data as unknown as OrdersFullView
}
