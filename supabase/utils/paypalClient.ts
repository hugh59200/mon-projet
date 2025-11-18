import { ENV } from './clients.ts'

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET')!

export const BASE_URL =
  ENV === 'development' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'

export async function getPayPalAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error('Unable to get PayPal access token')

  const data = await res.json()
  return data.access_token
}
