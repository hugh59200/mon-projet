import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const rawSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')!
const secret = rawSecret.replace('v1,whsec_', '')
const wh = new Webhook(secret)

serve(async (req) => {
  if (req.method !== 'POST') {
    console.warn('🔒 Requête non autorisée (non-POST)')
    return new Response('not allowed', { status: 405 })
  }

  try {
    const payloadText = await req.text()
    const headers = Object.fromEntries(req.headers)

    console.log('📥 PAYLOAD TEXT:', payloadText)
    console.log('📬 HEADERS:', headers)

    const { user, email_data } = wh.verify(payloadText, headers) as {
      user: { email: string; user_metadata?: any }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
        token_new?: string
        token_hash_new?: string
      }
    }

    console.log('✅ Webhook verified')
    console.log('👤 User:', user)
    console.log('📧 Email Data:', email_data)

    const email = user.email
    const type = email_data.email_action_type

    let subject = ''
    let html = ''
    const confirmationUrl = `${email_data.site_url}/verify?token=${email_data.token}`

    console.log(`🔎 Email action type: ${type}`)
    console.log(`🔗 Reconstructed confirmation URL: ${confirmationUrl}`)

    if (type === 'signup') {
      subject = 'Confirmez votre inscription ✅'
      html = renderEmailTemplate('signup_confirmation', {
        full_name: user.user_metadata?.full_name ?? '',
        confirmation_url: confirmationUrl,
      })
    } else if (type === 'recovery') {
      subject = 'Réinitialisation du mot de passe'
      html = renderEmailTemplate('custom', {
        full_name: user.user_metadata?.full_name ?? '',
        body: `<p>Pour réinitialiser votre mot de passe, cliquez ici :</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
      })
    } else if (type === 'email_change') {
      subject = 'Confirmez votre nouvelle adresse email'
      html = renderEmailTemplate('custom', {
        full_name: user.user_metadata?.full_name ?? '',
        body: `<p>Pour confirmer votre nouvelle adresse email, cliquez ici :</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
      })
    } else {
      console.warn(`⚠ Type d'action inconnu: ${type}, on ignore.`)
      return new Response('ignored', { status: 200 })
    }

    console.log('📨 Envoi en cours...')
    const result = await sendEmail({
      to: email,
      subject,
      html,
      type: 'confirmation', // forcé pour correspondre à emails_sent.type
    })

    console.log('✅ Envoi terminé', result)

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Hook failed:', err)
    return new Response(JSON.stringify({ error: `${err}`, success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
