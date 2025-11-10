import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { sendEmail } from '../utils/sendEmail.ts'
import { renderEmailTemplate } from '../utils/templates/renderEmailTemplate.ts'

const rawSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')!
const secret = rawSecret.replace('v1,whsec_', '')
const wh = new Webhook(secret)

serve(async (req) => {
  if (req.method !== 'POST') return new Response('not allowed', { status: 405 })

  try {
    const payloadText = await req.text()
    const headers = Object.fromEntries(req.headers)
    const { user, email_data } = wh.verify(payloadText, headers)

    const email = user.email
    const type = email_data.email_action_type
    const confirmationUrl = `${email_data.site_url}/verify?token=${email_data.token}`

    let subject = ''
    let html = ''

    switch (type) {
      case 'signup':
        subject = 'Confirmez votre inscription ✅'
        html = renderEmailTemplate('signup_confirmation', {
          full_name: user.user_metadata?.full_name ?? '',
          confirmation_url: confirmationUrl,
        })
        break

      case 'recovery':
        subject = 'Réinitialisation du mot de passe'
        html = renderEmailTemplate('custom', {
          body: `<p>Réinitialisez votre mot de passe :</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
        })
        break

      case 'email_change':
        subject = 'Confirmez votre nouvelle adresse email'
        html = renderEmailTemplate('custom', {
          body: `<p>Confirmez votre nouvelle adresse email :</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
        })
        break

      default:
        return new Response('Ignored', { status: 200 })
    }

    const result = await sendEmail({ to: email, subject, html, type: 'confirmation' })
    return new Response(JSON.stringify({ success: true, result }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err), success: false }), { status: 401 })
  }
})
