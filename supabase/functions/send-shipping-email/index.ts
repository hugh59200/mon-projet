import { serve } from 'https://deno.land/std/http/server.ts'
import { supabase } from '../../utils/clients.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

serve(async (req: Request) => {
  try {
    const { order_id } = await req.json()
    if (!order_id) return new Response('Missing order_id', { status: 400 })

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) return new Response('Order not found', { status: 404 })

    // ✅ auto-detect tracking URL
    const tracking_url = order.tracking_number
      ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${order.tracking_number}`
      : undefined

    const html = renderEmailTemplate('shipping', {
      order_id,
      full_name: order.shipping_name,
      carrier: order.carrier,
      tracking_number: order.tracking_number,
      tracking_url,
      items: order.detailed_items,
    })

    await sendEmail({
      to: order.shipping_email,
      subject: `Votre commande #${order_id} est expédiée 📦`,
      html,
      type: 'shipping',
      order_id,
    })

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
})
