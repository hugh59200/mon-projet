// utils/sendEmail.ts
import { resend } from './clients.ts'
import { logEmail } from './logEmail.ts'

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
  type?: string
  order_id?: string
}) {
  console.log(`📧 Sending email to ${to} | Subject: ${subject}`)

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    })

    console.log('✅ Resend response:', result)

    // ✅ Statut toujours SENT si pas d'erreur JS
    await logEmail({
      to_email: to,
      subject,
      body_html: html,
      type,
      order_id,
      provider_response: result,
      status: 'sent',
    })

    return result
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
