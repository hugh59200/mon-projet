// supabase/utils/emailProvider.ts

export type EmailProviderId = 'resend' | 'mailgun' | 'ses'

const EMAIL_PROVIDER = (Deno.env.get('EMAIL_PROVIDER') ?? 'resend') as EmailProviderId

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY') ?? ''
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN') ?? '' // ex: sandboxxxxxx.mailgun.org

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from: string // IMPORTANT
}

async function sendWithResend(payload: EmailPayload) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY manquant')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`)
  }

  return res.json()
}

async function sendWithMailgun(payload: EmailPayload) {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    throw new Error('MAILGUN_API_KEY ou MAILGUN_DOMAIN manquant')
  }

  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`

  const body = new URLSearchParams({
    from: payload.from, // ICI le FROM sandbox correct
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!res.ok) {
    throw new Error(`Mailgun error ${res.status}: ${await res.text()}`)
  }

  return res.json()
}

export function sendWithProvider(payload: EmailPayload) {
  switch (EMAIL_PROVIDER) {
    case 'resend':
      return sendWithResend(payload)
    case 'mailgun':
      return sendWithMailgun(payload)
    default:
      throw new Error(`Email provider inconnu: ${EMAIL_PROVIDER}`)
  }
}
