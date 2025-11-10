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
  await supabase.from('emails_sent').insert({
    order_id,
    to_email,
    subject,
    body_html,
    type,
    provider_response: provider_response ? JSON.stringify(provider_response) : null,
    status,
    sent_at: new Date().toISOString(),
  })
}
