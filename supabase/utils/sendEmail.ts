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

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  })

  console.log('✅ Resend response:', result)

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
