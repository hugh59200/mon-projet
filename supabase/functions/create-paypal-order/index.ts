import { ENV, PAYMENT_CANCEL_URL, PAYMENT_SUCCESS_URL_BASE, supabase } from '../../utils/clients.ts'

import { createHandler } from '../../utils/createHandler.ts'

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET')!

const BASE_URL =
  ENV === 'development' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

interface CreatePaypalOrderBody {
  amount: number
  email: string
  orderId: string
}

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

  const data = await res.json()
  return data.access_token
}

Deno.serve(
  createHandler<CreatePaypalOrderBody>(async (_req, body) => {
    const { amount, email, orderId } = body
    if (!amount || !email || !orderId) throw new Error('amount, email et orderId requis')

    const accessToken = await getAccessToken()

    const info = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: amount.toFixed(2),
          },
          custom_id: orderId,
        },
      ],
      application_context: {
        return_url: `${PAYMENT_SUCCESS_URL_BASE}?orderId=${orderId}`,
        cancel_url: PAYMENT_CANCEL_URL,
        user_action: 'PAY_NOW',
      },
    }

    const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    })

    const data = await response.json()

    const approvalUrl =
      data.links?.find((l: any) => l.rel === 'approve')?.href ??
      data.links?.find((l: any) => l.rel === 'payer-action')?.href

    if (!approvalUrl) {
      console.error('⚠️ APPROVAL URL MISSING:', data)
      throw new Error('Missing approval link from PayPal')
    }

    await supabase
      .from('orders')
      .update({
        paypal_order_id: data.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    // 👉 createHandler encapsule ceci correctement
    return {
      url: approvalUrl,
      paypalOrderId: data.id,
    }
  }),
)
