// supabase/functions/utils/logEmail.ts
import { supabase } from './clients.ts'

export async function logEmail({
  order_id,
  to_email,
  subject,
  body_html,
  type,
  provider_response,
  status = 'sent',
}: any) {
  // On utilise maybeSingle pour éviter de planter si l'order_id est null (ex: signup)
  // Mais ici c'est un insert simple.

  const { error } = await supabase.from('emails_sent').insert({
    order_id: order_id || null,
    to_email,
    subject,
    body_html, // Stocker le HTML peut prendre de la place, attention à la limite de taille DB
    type,
    provider_response: provider_response ? JSON.stringify(provider_response) : null,
    status,
    sent_at: new Date().toISOString(),
  })

  if (error) {
    console.error('❌ Failed to log email in DB:', error)
  }
}
