import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const rawSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')!
const secret = rawSecret.replace('v1,whsec_', '')
const wh = new Webhook(secret)

const TITLES = {
  signup: 'Confirmez votre inscription ✅',
  recovery: 'Réinitialisation du mot de passe',
  email_change: 'Confirmez votre nouvelle adresse email',
} as const

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)

    const { user, email_data } = wh.verify(payload, headers) as {
      user: { email: string; user_metadata?: { full_name?: string } }
      email_data: {
        site_url: string
        token: string
        email_action_type: keyof typeof TITLES
      }
    }

    const confirmation_url = `${email_data.site_url}/auth/callback?type=${email_data.email_action_type}&token=${email_data.token}&email=${user.email}`

    const subject = TITLES[email_data.email_action_type]

    const html = renderEmailTemplate(email_data.email_action_type, {
      full_name: user.user_metadata?.full_name ?? '',
      confirmation_url,
      url: confirmation_url,
    })

    const result = await sendEmail({ to: user.email, subject, html })

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
