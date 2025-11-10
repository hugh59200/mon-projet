// supabase/functions/order-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase } from '../../utils/clients.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

serve(async (req: Request) => {
  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing order_id' }), {
        status: 400,
      })
    }

    // ✅ Récupération complète de la commande
    const { data: order, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (error || !order) {
      return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
        status: 404,
      })
    }

    const orderNumber = order.order_number ?? order_id
    const email = order.shipping_email

    // ✅ Mail HTML via template
    const html = renderEmailTemplate('confirmation', {
      order_id,
      order_number: orderNumber,
      items: order.detailed_items || [],
      total_amount: order.total_amount,
      full_name: order.shipping_name,
      created_at: order.created_at,
      ctaLabel: 'Voir ma commande',
      ctaUrl: `https://fast-peptides.com/compte/commandes/${orderNumber}`,
    })

    // ✅ Envoi mail + log
    await sendEmail({
      to: email,
      subject: `Confirmation commande #${orderNumber}`,
      html,
      type: 'confirmation',
      order_id,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
    })
  }
})
