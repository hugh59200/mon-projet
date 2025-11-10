import { Resend } from 'https://esm.sh/resend@3.2.0'
import { logEmail } from './logEmail.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

// Adresse d’envoi unique, valable en dev & prod ✅
const FROM = 'Fast Peptides <no-reply@fast-peptides.com>'

export async function sendEmail({
  to,
  subject,
  html,
  type = 'custom',
  order_id,
}: {
  to: string
  subject: string
  html: string
  type?: 'signup' | 'recovery' | 'email_change' | 'confirmation' | 'payment' | 'custom'
  order_id?: string
}) {
  console.log(`📤 Preparing to send email to ${to}`)
  console.log(`🧬 From: ${FROM}`)

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  })

  console.log('📦 Resend response:', result)

  await logEmail({
    to_email: to,
    subject,
    body_html: html,
    type,
    order_id,
    provider_response: result,
    status: result?.id ? 'sent' : 'error',
  })

  return result
}
