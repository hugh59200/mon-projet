// supabase/utils/sendEmail.ts

import { EMAIL_PROVIDER, sendWithProvider } from './emailProvider.ts'
import { logEmail } from './logEmail.ts'

const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN') ?? ''
const RESEND_DOMAIN = Deno.env.get('RESEND_DOMAIN') ?? ''

// Contrôle dynamique du From
function buildFrom() {
  if (EMAIL_PROVIDER === 'resend') {
    // Resend impose d'utiliser le domaine vérifié
    return `FP Store <contact@${RESEND_DOMAIN}>`
  }
  if (EMAIL_PROVIDER === 'mailgun') {
    return `FP Store <postmaster@${MAILGUN_DOMAIN}>`
  }
  // Fallback générique pour dev
  return 'FP Store <noreply@fast-peptides.com>'
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

  console.log(`📧 Envoi email [${type}] via ${EMAIL_PROVIDER} à ${to}`)

  try {
    const providerResponse = await sendWithProvider({
      from: FROM,
      to,
      subject,
      html,
    })

    // Log succès en background (await non bloquant si on veut, mais await conseillé ici)
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
    console.error('❌ Erreur critique envoi email:', error)

    // Log l'échec
    await logEmail({
      to_email: to,
      subject,
      body_html: html,
      type,
      order_id,
      provider_response: error instanceof Error ? { message: error.message } : error,
      status: 'error',
    })

    // On relance l'erreur pour que la Edge Function sache que ça a planté
    throw error
  }
}
