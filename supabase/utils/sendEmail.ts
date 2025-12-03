// supabase/utils/sendEmail.ts

import { sendWithProvider } from './emailProvider.ts'
import { logEmail } from './logEmail.ts'

const RESEND_DOMAIN = Deno.env.get('RESEND_DOMAIN') ?? ''

// Contrôle dynamique du From
function buildFrom() {
  if (RESEND_DOMAIN) {
    return `FP Store <contact@${RESEND_DOMAIN}>`
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

  console.log(`📧 Envoi email [${type}] via Resend à ${to}`)

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
