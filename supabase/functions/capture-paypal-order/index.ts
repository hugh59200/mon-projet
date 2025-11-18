import {
  ENV,
  FUNCTION_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  supabase,
} from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'

// 🌍 PayPal API base URL
const BASE_URL =
  ENV === 'development' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

// 🔐 Token PayPal
async function getAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error('Unable to get PayPal token')

  return (await res.json()).access_token
}

export default Deno.serve(
  createHandler(async (_req, body: { orderId: string }) => {
    const { orderId } = body
    if (!orderId) throw new Error('orderId requis')

    // 1️⃣ Récupérer l'order PayPal
    const { data: order } = await supabase
      .from('orders')
      .select('paypal_order_id')
      .eq('id', orderId)
      .maybeSingle()

    if (!order?.paypal_order_id) {
      throw new Error('Aucun paypal_order_id trouvé')
    }

    const paypalId = order.paypal_order_id

    // 2️⃣ Token PayPal
    const token = await getAccessToken()

    // 3️⃣ Capture paiement
    const captureRes = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await captureRes.json()

    if (captureData.status !== 'COMPLETED') {
      console.error('💥 Capture PayPal:', captureData)
      throw new Error('Paiement PayPal non confirmé')
    }

    // 4️⃣ Update DB
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    await supabase.from('payment_events').insert({
      provider: 'paypal',
      order_id: orderId,
      payload: captureData,
    })

    // 5️⃣ Email confirmation
    await fetch(`${FUNCTION_URL}/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })

    return { status: 'paid', orderId }
  }),
)
