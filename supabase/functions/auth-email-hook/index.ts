import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const FRONT_URL = Deno.env.get('FRONT_URL') ?? 'https://fast-peptides.com'

// Typage du payload envoyé par Supabase Auth Webhooks
interface SupabaseAuthEmailHookPayload {
  type: string
  user: {
    email: string
    user_metadata?: { full_name?: string }
  }
  email_data: {
    token: string
    email_action_type: 'signup' | 'recovery' | 'email_change'
  }
}

const TITLES = {
  signup: 'Confirmez votre inscription ✅',
  recovery: 'Réinitialisation du mot de passe',
  email_change: 'Confirmez votre nouvelle adresse email',
} as const

export default Deno.serve(
  createHandler<SupabaseAuthEmailHookPayload>(async (_req, body) => {
    console.log('📩 Auth Email Hook Triggered:', body)

    const { user, email_data } = body

    if (!user?.email) throw new Error('Missing user email')
    if (!email_data?.token || !email_data?.email_action_type) {
      throw new Error('Missing email_data from Supabase hook')
    }

    const action = email_data.email_action_type
    const subject = TITLES[action]

    const confirmation_url =
      `${FRONT_URL}/auth/callback?token=${encodeURIComponent(email_data.token)}` +
      `&type=${encodeURIComponent(action)}&email=${encodeURIComponent(user.email)}`

    const html = renderEmailTemplate(action, {
      full_name: user.user_metadata?.full_name ?? '',
      confirmation_url,
      url: confirmation_url,
    })

    const result = await sendEmail({
      to: user.email,
      subject,
      html,
      type: `auth_${action}`,
    })

    return { success: true, result }
  }),
)
