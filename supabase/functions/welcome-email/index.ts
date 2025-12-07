// supabase/functions/welcome-email/index.ts
// Envoi de l'email de bienvenue après confirmation de l'email

import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface WelcomeEmailBody {
  user_id: string
  email: string
  full_name?: string
  locale?: string
}

export default Deno.serve(
  createHandler<WelcomeEmailBody>(async (_req, body) => {
    console.log('👋 Welcome Email Triggered:', body)

    const { email, full_name } = body

    if (!email) throw new Error('Missing email')

    // Déterminer la locale
    const locale = getValidLocale(body.locale ?? 'fr')
    const t = translations.welcome

    const html = renderEmailTemplate('welcome', {
      full_name: full_name ?? '',
      locale,
    })

    const result = await sendEmail({
      to: email,
      subject: t.subject[locale],
      html,
      type: 'welcome',
    })

    console.log('✅ Welcome email sent to:', email)

    return { success: true, result, email, locale }
  }),
)
