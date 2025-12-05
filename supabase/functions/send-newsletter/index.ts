// supabase/functions/send-newsletter/index.ts
// Edge Function pour envoyer des newsletters aux abonnés

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'

// ============================================================
// TYPES
// ============================================================

interface NewsletterSendBody {
  campaign_id?: string
  subject: string
  preview_text?: string
  content_html: string
  content_text?: string
  // Ciblage
  target_status?: 'active' | 'all'
  target_locales?: string[]
  target_topics?: string[]
  // Options
  test_email?: string // Si présent, envoie uniquement à cet email (test)
}

interface Subscriber {
  id: string
  email: string
  first_name: string | null
  locale: string
  preferences: {
    frequency: string
    topics: string[]
  }
}

// ============================================================
// TEMPLATE EMAIL NEWSLETTER PREMIUM
// ============================================================

function generateNewsletterEmailHtml(
  contentHtml: string,
  options: {
    previewText?: string
    subscriberEmail: string
    firstName?: string
    locale?: string
  }
): string {
  const { previewText, subscriberEmail, firstName, locale = 'fr' } = options
  const greeting = firstName ? `Bonjour ${firstName},` : locale === 'fr' ? 'Bonjour,' : 'Hello,'
  const unsubscribeUrl = `${APP_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`
  const preferencesUrl = `${APP_BASE_URL}/newsletter/preferences?email=${encodeURIComponent(subscriberEmail)}`

  const footerTexts = {
    fr: {
      unsubscribe: 'Se désinscrire',
      preferences: 'Gérer mes préférences',
      receivedBecause: 'Vous recevez cet email car vous êtes inscrit à notre newsletter.',
      copyright: '© 2024 Atlas Lab Solutions LLC. Tous droits réservés.',
      tagline: 'Peptides de recherche haute pureté',
    },
    en: {
      unsubscribe: 'Unsubscribe',
      preferences: 'Manage preferences',
      receivedBecause: 'You received this email because you subscribed to our newsletter.',
      copyright: '© 2024 Atlas Lab Solutions LLC. All rights reserved.',
      tagline: 'High-purity research peptides',
    },
  }

  const t = footerTexts[locale as keyof typeof footerTexts] || footerTexts.en

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${previewText ? `<meta name="description" content="${previewText}">` : ''}
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0a0a0f !important; }
      .email-container { background-color: #111118 !important; }
      .email-content { color: #e5e7eb !important; }
      .email-footer { background-color: #0a0a0f !important; }
    }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 20px !important; }
      .email-content { padding: 24px 20px !important; }
      .email-logo { width: 120px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;" class="email-body">
  ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>` : ''}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%); padding: 32px 40px; text-align: center;">
              <!-- Logo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img
                      src="${APP_BASE_URL}/logo-white.png"
                      alt="Atlas Lab Solutions"
                      width="160"
                      class="email-logo"
                      style="display: block; max-width: 160px; height: auto;"
                    />
                  </td>
                </tr>
              </table>
              <!-- Decorative line -->
              <div style="margin-top: 24px; height: 1px; background: linear-gradient(90deg, transparent, rgba(90, 148, 242, 0.5), transparent);"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 40px; color: #374151;">
              <!-- Greeting -->
              <p style="margin: 0 0 24px; font-size: 16px; color: #6b7280;">${greeting}</p>

              <!-- Main Content -->
              <div style="font-size: 16px; line-height: 1.7; color: #374151;">
                ${contentHtml}
              </div>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a
                      href="${APP_BASE_URL}/catalogue"
                      style="display: inline-block; background: linear-gradient(135deg, #5a94f2 0%, #3b7aef 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(90, 148, 242, 0.35);"
                    >
                      ${locale === 'fr' ? 'Découvrir le catalogue' : 'Explore catalogue'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer" style="background-color: #f9fafb; padding: 32px 40px;">
              <!-- Social / Quick Links -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${preferencesUrl}" style="display: inline-block; margin: 0 12px; color: #6b7280; text-decoration: none; font-size: 13px;">${t.preferences}</a>
                    <span style="color: #d1d5db;">•</span>
                    <a href="${unsubscribeUrl}" style="display: inline-block; margin: 0 12px; color: #6b7280; text-decoration: none; font-size: 13px;">${t.unsubscribe}</a>
                  </td>
                </tr>
              </table>

              <!-- Legal text -->
              <p style="margin: 0 0 8px; text-align: center; font-size: 12px; color: #9ca3af;">
                ${t.receivedBecause}
              </p>
              <p style="margin: 0 0 16px; text-align: center; font-size: 12px; color: #9ca3af;">
                ${t.copyright}
              </p>

              <!-- Brand tagline -->
              <p style="margin: 0; text-align: center; font-size: 11px; color: #c9d1d9; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                ${t.tagline}
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// ============================================================
// HANDLER PRINCIPAL
// ============================================================

Deno.serve(
  createHandler<NewsletterSendBody>(async (_req, body) => {
    const {
      campaign_id,
      subject,
      preview_text,
      content_html,
      target_status = 'active',
      target_locales,
      test_email,
    } = body

    if (!subject || !content_html) {
      throw new Error('Missing required fields: subject, content_html')
    }

    console.log(`📧 Envoi newsletter: "${subject}"`)

    // Mode test: envoyer uniquement à l'email de test
    if (test_email) {
      console.log(`🧪 Mode test: envoi à ${test_email}`)

      const html = generateNewsletterEmailHtml(content_html, {
        previewText: preview_text,
        subscriberEmail: test_email,
        firstName: 'Test',
        locale: 'fr',
      })

      await sendEmail({
        to: test_email,
        subject: `[TEST] ${subject}`,
        html,
        type: 'newsletter_test',
      })

      return {
        success: true,
        mode: 'test',
        sent_to: test_email,
      }
    }

    // Mode production: récupérer les abonnés
    let query = supabase
      .from('newsletter_subscribers')
      .select('id, email, first_name, locale, preferences')

    if (target_status === 'active') {
      query = query.eq('status', 'active')
    }

    if (target_locales && target_locales.length > 0) {
      query = query.in('locale', target_locales)
    }

    const { data: subscribers, error: fetchError } = await query

    if (fetchError) {
      console.error('Erreur fetch subscribers:', fetchError)
      throw new Error('Failed to fetch subscribers')
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        sent_count: 0,
        message: 'No subscribers found',
      }
    }

    console.log(`📬 ${subscribers.length} abonnés trouvés`)

    // Envoyer les emails
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Créer ou mettre à jour la campagne si campaign_id est fourni
    if (campaign_id) {
      await supabase
        .from('newsletter_campaigns')
        .update({
          recipients_count: subscribers.length,
          status: 'sending',
          sent_at: new Date().toISOString(),
        })
        .eq('id', campaign_id)
    }

    // Envoyer les emails par batch de 10 pour éviter les rate limits
    const batchSize = 10
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize) as Subscriber[]

      await Promise.all(
        batch.map(async (subscriber) => {
          try {
            const html = generateNewsletterEmailHtml(content_html, {
              previewText: preview_text,
              subscriberEmail: subscriber.email,
              firstName: subscriber.first_name || undefined,
              locale: subscriber.locale,
            })

            await sendEmail({
              to: subscriber.email,
              subject,
              html,
              type: 'newsletter',
            })

            // Enregistrer l'envoi
            if (campaign_id) {
              await supabase.from('newsletter_sends').insert({
                campaign_id,
                subscriber_id: subscriber.id,
                sent_at: new Date().toISOString(),
              })
            }

            // Mettre à jour le subscriber
            await supabase
              .from('newsletter_subscribers')
              .update({
                last_email_sent_at: new Date().toISOString(),
                emails_sent_count: supabase.raw('emails_sent_count + 1'),
              })
              .eq('id', subscriber.id)

            results.sent++
          } catch (err) {
            results.failed++
            results.errors.push(`${subscriber.email}: ${(err as Error).message}`)
            console.error(`❌ Erreur envoi à ${subscriber.email}:`, err)
          }
        })
      )

      // Pause entre les batches pour éviter les rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Mettre à jour la campagne avec les stats finales
    if (campaign_id) {
      await supabase
        .from('newsletter_campaigns')
        .update({
          sent_count: results.sent,
          status: 'sent',
        })
        .eq('id', campaign_id)
    }

    return {
      success: true,
      sent_count: results.sent,
      failed_count: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    }
  })
)
