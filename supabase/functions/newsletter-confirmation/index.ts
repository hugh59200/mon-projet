// supabase/functions/newsletter-confirmation/index.ts
// Envoi de l'email de confirmation d'inscription à la newsletter avec code promo -10%

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

// Code promo fixe pour les nouveaux abonnés newsletter
const NEWSLETTER_PROMO_CODE = 'WELCOME10'

interface NewsletterConfirmationBody {
  subscriber_id?: string
  email?: string
  first_name?: string
  confirmation_token?: string
  locale?: string
}

export default Deno.serve(
  createHandler<NewsletterConfirmationBody>(async (_req, body) => {
    console.log('📧 Newsletter Confirmation Email Triggered:', body)

    const { subscriber_id, email, first_name, confirmation_token, locale: bodyLocale } = body

    // Récupérer les infos du subscriber si on a l'ID
    let subscriberEmail = email
    let subscriberFirstName = first_name
    let subscriberToken = confirmation_token
    let subscriberLocale = bodyLocale

    if (subscriber_id) {
      const { data: subscriber, error } = await supabase
        .from('newsletter_subscribers')
        .select('email, first_name, confirmation_token, locale')
        .eq('id', subscriber_id)
        .single()

      if (error || !subscriber) {
        throw new Error(`Subscriber not found: ${subscriber_id}`)
      }

      subscriberEmail = subscriber.email
      subscriberFirstName = subscriber.first_name
      subscriberToken = subscriber.confirmation_token
      subscriberLocale = subscriber.locale
    }

    if (!subscriberEmail) {
      throw new Error('Missing email')
    }

    if (!subscriberToken) {
      throw new Error('Missing confirmation token')
    }

    // Construire l'URL de confirmation
    const confirmationUrl = `${APP_BASE_URL}/newsletter/confirm?token=${subscriberToken}`

    // Déterminer la locale
    const locale = getValidLocale(subscriberLocale ?? 'fr')
    const t = translations.newsletterConfirmation

    // Générer le HTML de l'email
    const html = renderEmailTemplate('newsletter_confirmation', {
      first_name: subscriberFirstName,
      confirmation_url: confirmationUrl,
      promo_code: NEWSLETTER_PROMO_CODE,
      locale,
    })

    // Envoyer l'email
    const result = await sendEmail({
      to: subscriberEmail,
      subject: t.subject[locale],
      html,
      type: 'newsletter_confirmation',
    })

    console.log('✅ Newsletter confirmation email sent to:', subscriberEmail)

    return {
      success: true,
      result,
      email: subscriberEmail,
      locale,
      confirmation_url: confirmationUrl,
    }
  }),
)
