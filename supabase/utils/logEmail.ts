import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Type du payload attendu pour le logging des e-mails
 */
export type LogEmailPayload = {
  order_id?: string
  to_email: string
  subject: string
  body_html: string
  type: 'confirmation' | 'status_update' | 'shipping' | 'cancelation' | 'payment' | 'custom'
  provider_response?: any
  status?: 'sent' | 'error'
}

/**
 * Fonction de log des e-mails envoyés dans la table `emails_sent`
 * Utilisable depuis n’importe quelle Edge Function
 */
export async function logEmail({
  order_id,
  to_email,
  subject,
  body_html,
  type,
  provider_response,
  status = 'sent',
}: LogEmailPayload) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Impossible de logger l’email : Supabase env vars manquantes')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('emails_sent').insert([
      {
        order_id,
        to_email,
        subject,
        body_html,
        type,
        provider_response: provider_response ? JSON.stringify(provider_response) : null,
        status,
        sent_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    console.log(`📨 Email loggé : ${to_email} (${type})`)
  } catch (err) {
    console.error('❌ Erreur lors du log email:', err)
  }
}
