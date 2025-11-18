import { createWebhookHandler } from '../utils/createHandler.ts'
import {
  errorResponse,
  logPaymentEvent,
  successResponse,
  updateOrderPaid,
} from '../utils/paymentUtils.ts'
import { BASE_URL, getPayPalAccessToken } from '../utils/paypalClient.ts'

export default Deno.serve(
  createWebhookHandler(async (rawBody) => {
    try {
      const event = JSON.parse(rawBody)

      await logPaymentEvent('paypal', event.resource?.purchase_units?.[0]?.custom_id ?? null, event)

      if (event.event_type !== 'CHECKOUT.ORDER.APPROVED') {
        return { ignored: event.event_type }
      }

      const paypalOrderId = event.resource.id
      const orderId = event.resource.purchase_units?.[0]?.custom_id

      if (!orderId || !paypalOrderId) throw new Error('Missing order ID')

      // 1) Capture payment
      const token = await getPayPalAccessToken()

      await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      // 2) Unified update logic
      await updateOrderPaid(orderId, paypalOrderId)

      return successResponse(orderId)
    } catch (err) {
      return errorResponse(err)
    }
  }),
)
