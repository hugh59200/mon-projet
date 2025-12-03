// supabase/utils/emailProvider.ts

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from: string
}

export async function sendWithProvider(payload: EmailPayload) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY manquant')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`)
  return res.json()
}
