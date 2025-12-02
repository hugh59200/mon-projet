import { APP_BASE_URL } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

// Typage du payload envoyé par Supabase Auth Webhooks
interface SupabaseAuthEmailHookPayload {
  type: string
  user: {
    email: string
    user_metadata?: {
      full_name?: string
      locale?: string
    }
  }
  email_data: {
    token: string
    token_hash: string
    email_action_type: 'signup' | 'recovery' | 'email_change'
  }
}

export default Deno.serve(
  createHandler<SupabaseAuthEmailHookPayload>(async (_req, body) => {
    console.log('📩 Auth Email Hook Triggered:', body)

    const { user, email_data } = body

    if (!user?.email) throw new Error('Missing user email')
    if (!email_data?.token || !email_data?.email_action_type) {
      throw new Error('Missing email_data from Supabase hook')
    }

    // Déterminer la locale depuis user_metadata ou fallback EN
    const locale = getValidLocale(user.user_metadata?.locale)

    const action = email_data.email_action_type

    // Sujets traduits selon l'action
    const subjects = {
      signup: translations.signup.subject[locale],
      recovery: translations.recovery.subject[locale],
      email_change: translations.emailChange.subject[locale],
    } as const

    const subject = subjects[action]

    const confirmation_url =
      `${APP_BASE_URL}/auth/callback?token_hash=${encodeURIComponent(email_data.token_hash)}` +
      `&type=${encodeURIComponent(action)}&email=${encodeURIComponent(user.email)}`

    const html = renderEmailTemplate(action, {
      full_name: user.user_metadata?.full_name ?? '',
      confirmation_url,
      url: confirmation_url,
      locale,
    })

    const result = await sendEmail({
      to: user.email,
      subject,
      html,
      type: `auth_${action}`,
    })

    return { success: true, result, locale }
  }),
)
