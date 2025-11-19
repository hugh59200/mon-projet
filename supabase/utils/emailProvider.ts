// supabase/utils/emailProvider.ts

export type EmailProviderId = 'resend' | 'mailgun' | 'ses'

const EMAIL_PROVIDER = 'resend' as EmailProviderId
// const EMAIL_PROVIDER = (Deno.env.get('EMAIL_PROVIDER') ?? 'resend') as EmailProviderId

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY') ?? ''
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN') ?? ''

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from: string
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
    from: payload.from,
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

// $ curl -s --user 'api:12a77a1f814ac8b98fd4dcd7f5571c4c-e80d8b76-a2b2063d' \
// >   https://api.mailgun.net/v3/sandboxb93ea55e02094656946885cbae43dcdc.mailgun.org/messages \
// >   -F from='Mailgun Sandbox <postmaster@sandboxb93ea55e02094656946885cbae43dcdc.mailgun.org>' \
// >   -F to='bogrand <h.bogrand@gmail.com>' \
// >   -F subject='Hello bogrand' \
// >   -F text='Congratulations bogrand, you just sent an email with Mailgun! You are truly awesome!' \
// >
// {"id":"<20251119085400.d527000563b0e927@sandboxb93ea55e02094656946885cbae43dcdc.mailgun.org>","message":"Queued. Thank you."}
