import type { OrderStatus } from '../../utils'
import { supabase } from '../supabaseClient'
import type { Json } from '../types/supabase' // Le type brut généré
import type { OrdersFullView } from '../types/supabase.types' // Tes types raccourcis
import { handleApi, handleMutation } from './helpers/HandleError'

// Type spécifique pour la création (ne vient pas de la DB directement)
export type CreateOrderPayload = {
  userId: string
  email: string
  fullName: string
  address: string
  zip: string
  city: string
  country: string
  paymentMethod: string
  // 💰 Nouveaux champs financiers V2
  subtotal: number
  taxAmount: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  // 🛒 Items
  items: {
    product_id: string
    quantity: number
    product_price: number // Prix unitaire au moment de l'achat
  }[]
}

/** * ✅ CRÉATION V2.0 (Complex RPC) */
export async function createOrder(payload: CreateOrderPayload): Promise<OrdersFullView> {
  // Conversion explicite des items en Json
  const itemsJson = payload.items as unknown as Json

  // ⚠️ CORRECTION ICI :
  // On ne fait PAS : const { data, error } = ...
  // On garde toute la réponse dans 'res'
  const res = await supabase.rpc('create_order_with_items_full', {
    p_user_id: payload.userId,
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

  // Maintenant 'res' correspond parfaitement au type attendu par handleApi
  const result = handleApi(res)

  // On force le cast car RPC renvoie du Json générique, mais on sait que c'est notre OrderFullView
  return result as unknown as OrdersFullView
}

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
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', orderId) // Attention: dans la vue c'est 'order_id', pas 'id'
    .single()

  return handleApi(res)
}

/** ✅ ADMIN : Suppression sécurisée */
export async function deleteOrderById(id: string) {
  // Le DELETE CASCADE sur la table 'orders' nettoiera automatiquement order_items et emails_sent
  const { error } = await supabase.from('orders').delete().eq('id', id)
  handleMutation(error)
}

/** ✅ ADMIN : Mise à jour du statut via RPC */
export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_new_status: status,
    p_send_email: true, // La RPC va créer l'entrée dans 'emails_sent'
  })

  handleMutation(error)
  return data as unknown as OrdersFullView
}
