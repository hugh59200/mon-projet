import { FUNCTION_URL } from '../../utils/clients.ts';
import { createWebhookHandler } from '../../utils/createHandler.ts';
import {
  errorResponse,
  logPaymentEvent,
  successResponse,
  updateOrderPaid,
} from '../../utils/paymentUtils.ts'
import { stripe, STRIPE_WEBHOOK_SECRET } from '../../utils/stripeClient.ts';

export default Deno.serve(
  createWebhookHandler(async (rawBody, req) => {
    try {
      const signature = req.headers.get('stripe-signature')
      if (!signature) throw new Error('Missing Stripe signature')

      const event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET,
      )

      // Log the raw event
      await logPaymentEvent('stripe', event.data?.object?.metadata?.order_id ?? null, event)

      if (event.type !== 'checkout.session.completed') {
        return { ignored: event.type }
      }

      const session = event.data.object
      const orderId = session.metadata?.order_id
      if (!orderId) throw new Error('Missing order_id')

      // Update DB
      await updateOrderPaid(orderId, session.payment_intent)

      // 🔥 déclenche l'email de confirmation
      await fetch(`${FUNCTION_URL}/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      return successResponse(orderId)
    } catch (err) {
      return errorResponse(err)
    }
  }),
)
