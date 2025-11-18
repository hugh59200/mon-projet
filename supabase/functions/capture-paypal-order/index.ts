import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'

interface CaptureBody {
  orderId: string
}

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET')!

const BASE_URL =
  Deno.env.get('ENV') === 'development'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'

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

Deno.serve(
  createHandler<CaptureBody>(async (_req, { orderId }) => {
    if (!orderId) throw new Error('orderId requis')

    // 1. récupérer l’id PayPal dans la DB
    const { data: order } = await supabase
      .from('orders')
      .select('paypal_order_id')
      .eq('id', orderId)
      .maybeSingle()

    if (!order?.paypal_order_id) throw new Error('Aucun paypal_order_id trouvé')

    const paypalId = order.paypal_order_id

    // 2. capture PayPal
    const accessToken = await getAccessToken()

    const capture = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    const captureData = await capture.json()

    if (captureData.status !== 'COMPLETED') throw new Error('Paiement non confirmé PayPal')

    // 3. Update order → PAID
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    // 4. Log event
    await supabase.from('payment_events').insert({
      provider: 'paypal',
      order_id: orderId,
      payload: captureData,
    })

    return { status: 'paid', orderId }
  }),
)
