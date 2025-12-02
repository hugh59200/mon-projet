// API Commandes - V3.2 (Mondial Relay Support)
import type { OrderStatus } from '@/utils'
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Json } from '@/supabase/types/supabase'
import type { OrdersFullView } from '@/supabase/types/supabase.types'
import { handleApi, handleMutation } from '../helpers/handleError'

// ============================================================
// TYPES
// ============================================================

export type RelayData = {
  relayId: string
  relayName: string
  relayAddress: string
  relayZipcode: string
  relayCity: string
  relayCountry?: string
}

export type CreateOrderPayload = {
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
  relayId?: string
  relayName?: string
  relayAddress?: string
  relayZipcode?: string
  relayCity?: string
  relayCountry?: string
}

export type CreateOrderResponse = {
  order_id: string
  tracking_token: string
  is_relay_delivery: boolean
  status: string
}

export type UpdateRelayResponse = {
  success: boolean
  message: string
  relay_id?: string
}

// ============================================================
// CRÉATION DE COMMANDE
// ============================================================

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const itemsJson = payload.items as unknown as Json

  const res = await supabase.rpc('create_order_with_items_full', {
    p_address: payload.address,
    p_city: payload.city,
    p_country: payload.country,
    p_discount_amount: payload.discountAmount,
    p_email: payload.email,
    p_full_name: payload.fullName,
    p_items: itemsJson,
    p_payment_method: payload.paymentMethod,
    p_relay_address: payload.relayAddress ?? undefined,
    p_relay_city: payload.relayCity ?? undefined,
    p_relay_country: payload.relayCountry ?? undefined,
    p_relay_id: payload.relayId ?? undefined,
    p_relay_name: payload.relayName ?? undefined,
    p_relay_zipcode: payload.relayZipcode ?? undefined,
    p_shipping_cost: payload.shippingCost,
    p_subtotal: payload.subtotal,
    p_tax_amount: payload.taxAmount,
    p_total_amount: payload.totalAmount,
    p_user_id: payload.userId!,
    p_zip: payload.zip,
  })

  const result = handleApi(res)
  return result as unknown as CreateOrderResponse
}

// ============================================================
// GESTION POINT RELAIS
// ============================================================

export async function updateOrderRelay(
  orderId: string,
  relay: RelayData,
): Promise<UpdateRelayResponse> {
  const { data, error } = await supabase.rpc('update_order_relay', {
    p_order_id: orderId,
    p_relay_id: relay.relayId,
    p_relay_name: relay.relayName,
    p_relay_address: relay.relayAddress,
    p_relay_zipcode: relay.relayZipcode,
    p_relay_city: relay.relayCity,
    p_relay_country: relay.relayCountry || 'FR',
  })

  if (error) throw error
  return data as UpdateRelayResponse
}

export async function removeOrderRelay(orderId: string): Promise<UpdateRelayResponse> {
  const { data, error } = await supabase.rpc('remove_order_relay', {
    p_order_id: orderId,
  })

  if (error) throw error
  return data as UpdateRelayResponse
}

export function isRelayDelivery(order: OrdersFullView | null): boolean {
  if (!order) return false
  return !!(order as any).relay_id || !!(order as any).is_relay_delivery
}

export function getDeliveryAddress(order: OrdersFullView | null): {
  name: string
  address: string
  zip: string
  city: string
  country: string
  isRelay: boolean
} | null {
  if (!order) return null

  const orderAny = order as any

  if (orderAny.relay_id) {
    return {
      name: orderAny.relay_name || orderAny.delivery_name || '',
      address: orderAny.relay_address || orderAny.delivery_address || '',
      zip: orderAny.relay_zipcode || orderAny.delivery_zip || '',
      city: orderAny.relay_city || orderAny.delivery_city || '',
      country: orderAny.relay_country || orderAny.delivery_country || 'FR',
      isRelay: true,
    }
  }

  return {
    name: orderAny.shipping_name || '',
    address: orderAny.shipping_address || '',
    zip: orderAny.shipping_zip || '',
    city: orderAny.shipping_city || '',
    country: orderAny.shipping_country || 'FR',
    isRelay: false,
  }
}

// ============================================================
// LECTURE DES COMMANDES
// ============================================================

export async function fetchOrders(): Promise<OrdersFullView[]> {
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .order('created_at', { ascending: false })

  return handleApi(res)
}

export async function fetchUserOrders(userId: string): Promise<OrdersFullView[]> {
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return handleApi(res)
}

export async function fetchOrderById(orderId: string): Promise<OrdersFullView | null> {
  const res = await supabase.from('orders_full_view').select('*').eq('order_id', orderId).single()
  return handleApi(res)
}

export async function deleteOrderById(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  handleMutation(error)
}

// ============================================================
// GUEST TRACKING
// ============================================================

export async function trackGuestOrderByToken(trackingToken: string): Promise<OrdersFullView> {
  const { data, error } = await supabase.rpc('get_guest_order_by_token', {
    p_tracking_token: trackingToken,
  })

  if (error) throw error

  const result = data as { found: boolean; message?: string; order?: OrdersFullView }

  if (!result.found || !result.order) {
    throw new Error(result.message || 'Commande introuvable')
  }

  return result.order
}

export async function trackGuestOrderByEmail(
  email: string,
  orderNumber: string,
): Promise<OrdersFullView> {
  const { data, error } = await supabase.rpc('get_guest_order_details', {
    p_email: email,
    p_order_number: orderNumber,
  })

  if (error) throw error

  const result = data as { found: boolean; message?: string; order?: OrdersFullView }

  if (!result.found || !result.order) {
    throw new Error(result.message || 'Commande introuvable ou informations incorrectes.')
  }

  return result.order
}

// ============================================================
// MISE À JOUR STATUT
// ============================================================

export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_new_status: status,
    p_send_email: true,
  })

  handleMutation(error)
  return data as unknown as OrdersFullView
}

// ============================================================
// STRIPE SESSION LOOKUP
// ============================================================

export async function fetchOrderByStripeSession(sessionId: string): Promise<{
  id: string
  email: string
  order_number: string
  tracking_token: string
  status: string
  total_amount: number
  is_guest_order: boolean
} | null> {
  const { data, error } = await supabase.rpc('get_order_by_stripe_session', {
    p_session_id: sessionId,
  })

  if (error) {
    console.error('Erreur fetchOrderByStripeSession:', error)
    return null
  }

  return data as any
}

// ============================================================
// ORDER SUMMARY (Public)
// ============================================================

export async function getOrderSummaryPublic(orderId: string) {
  const { data, error } = await supabase.rpc('get_order_summary_public', {
    p_order_id: orderId,
  })
  if (error) throw error
  return data
}

// ============================================================
// EDGE FUNCTIONS
// ============================================================

export async function invokeOrderConfirmation(orderId: string) {
  return await supabase.functions.invoke('order-confirmation', {
    body: { order_id: orderId },
  })
}

export async function invokeCapturePayPal(orderId: string) {
  return await supabase.functions.invoke('capture-paypal-order', {
    body: { orderId },
  })
}

export async function invokeSendOrderUpdate(orderId: string, status: string) {
  return await supabase.functions.invoke('send-order-update', {
    body: { order_id: orderId, status },
  })
}

// ============================================================
// ORDERS FULL VIEW
// ============================================================

export async function fetchOrderFullViewById(orderId: string) {
  const { data, error } = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', orderId)
    .single()

  if (error) throw error
  return data
}

export async function fetchLastUserOrder(userId: string) {
  const { data } = await supabase
    .from('orders')
    .select('id, email, order_number, tracking_token')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}
