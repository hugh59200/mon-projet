// supabase/utils/sendEmail.ts

import { sendWithProvider, EMAIL_PROVIDER } from './emailProvider.ts'
import { logEmail } from './logEmail.ts'

const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN') ?? ''
const RESEND_DOMAIN = Deno.env.get('RESEND_DOMAIN') ?? '' // ton domaine validé Resend

// Contrôle dynamique du From
function buildFrom() {
  if (EMAIL_PROVIDER === 'mailgun') {
    // Obligatoire en sandbox Mailgun
    return `Fast Peptides <postmaster@${MAILGUN_DOMAIN}>`
  }

  if (EMAIL_PROVIDER === 'resend') {
    // Doit être un domaine validé dans Resend
    return `Fast Peptides <noreply@${RESEND_DOMAIN}>`
  }

  throw new Error('Provider non supporté pour le champ From')
}

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
  const FROM = buildFrom()

  console.log(`📧 Sending email | provider: ${EMAIL_PROVIDER} | from: ${FROM} | to: ${to}`)

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
