// supabase/utils/sendEmail.ts

import { sendWithProvider } from './emailProvider.ts'
import { logEmail } from './logEmail.ts'

const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')!
const FROM = `Fast Peptides <postmaster@${MAILGUN_DOMAIN}>` // OBLIGATOIRE en sandbox

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
  type?: string
  order_id?: string
}) {
  console.log(`📧 Sending email via provider | to: ${to} | subject: ${subject}`)

  try {
    const providerResponse = await sendWithProvider({
      from: FROM,
      to,
      subject,
      html,
    })

    await logEmail({
      to_email: to,
      subject,
      body_html: html,
      type,
      order_id,
      provider_response: providerResponse,
      status: 'sent',
    })

    return providerResponse
  } catch (error) {
    console.error('❌ Error sending email:', error)

    await logEmail({
      to_email: to,
      subject,
      body_html: html,
      type,
      order_id,
      provider_response: error,
      status: 'error',
    })

    throw error
  }
}
