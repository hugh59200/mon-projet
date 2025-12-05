// supabase/functions/send-promo-email/index.ts
// Edge Function pour envoyer les emails de codes promo automatiques

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'

interface PromoEmailBody {
  type: 'welcome' | 'loyalty' | 'cart_abandonment'
  user_id?: string
  user_email: string
  promo_code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  expires_at?: string
  // Pour fidélité
  reward_level?: number
  orders_count?: number
  // Pour abandon panier
  cart_value?: number
}

// ============================================================
// TEMPLATES D'EMAILS
// ============================================================

function getEmailSubject(type: string, discountValue: number, discountType: string): string {
  const discountText = discountType === 'percentage' ? `${discountValue}%` : `${discountValue}€`

  switch (type) {
    case 'welcome':
      return `Bienvenue ! Voici -${discountText} sur votre première commande`
    case 'loyalty':
      return `Merci pour votre fidélité ! -${discountText} offerts`
    case 'cart_abandonment':
      return `Vous avez oublié quelque chose ? -${discountText} pour vous`
    default:
      return `Votre code promo : -${discountText}`
  }
}

function generatePromoEmailHtml(data: PromoEmailBody): string {
  const discountText = data.discount_type === 'percentage'
    ? `-${data.discount_value}%`
    : `-${data.discount_value}€`

  const expiresText = data.expires_at
    ? new Date(data.expires_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  let headerTitle: string
  let headerSubtitle: string
  let bodyText: string

  switch (data.type) {
    case 'welcome':
      headerTitle = 'Bienvenue chez FP Store !'
      headerSubtitle = 'Votre code de bienvenue'
      bodyText = `
        Nous sommes ravis de vous compter parmi nous !<br><br>
        Pour célébrer votre inscription, voici un code promo exclusif de <strong>${discountText}</strong>
        sur votre première commande.
      `
      break

    case 'loyalty':
      headerTitle = 'Merci pour votre fidélité !'
      headerSubtitle = `Niveau ${data.reward_level ?? 1} atteint`
      bodyText = `
        Vous avez passé <strong>${data.orders_count ?? 0} commandes</strong> chez nous.<br><br>
        Pour vous remercier de votre confiance, voici un code promo de <strong>${discountText}</strong>.
      `
      break

    case 'cart_abandonment':
      headerTitle = 'Vous avez oublié quelque chose ?'
      headerSubtitle = 'Votre panier vous attend'
      bodyText = `
        Nous avons remarqué que vous aviez des articles dans votre panier${data.cart_value ? ` d'une valeur de <strong>${data.cart_value.toFixed(2)}€</strong>` : ''}.<br><br>
        Pour vous aider à finaliser votre commande, voici un code promo de <strong>${discountText}</strong>.
      `
      break

    default:
      headerTitle = 'Code promo pour vous'
      headerSubtitle = 'Offre spéciale'
      bodyText = `Voici un code promo de <strong>${discountText}</strong> à utiliser sur votre prochaine commande.`
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">${headerTitle}</h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">${headerSubtitle}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                ${bodyText}
              </p>

              <!-- Code Promo Box -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #22c55e; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 500;">Votre code promo</p>
                <p style="margin: 0; color: #15803d; font-size: 32px; font-weight: 700; letter-spacing: 2px; font-family: 'SF Mono', 'Fira Code', monospace;">${data.promo_code}</p>
                <p style="margin: 8px 0 0; color: #16a34a; font-size: 20px; font-weight: 600;">${discountText}</p>
              </div>

              ${expiresText ? `
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; text-align: center;">
                ⏰ Valable jusqu'au <strong>${expiresText}</strong>
              </p>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${APP_BASE_URL}/catalogue"
                       style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                      Découvrir le catalogue
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; color: #9ca3af; font-size: 13px; text-align: center;">
                Entrez ce code lors du paiement pour bénéficier de votre remise.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                FP Store — Peptides de recherche de haute qualité
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Cet email a été envoyé à ${data.user_email}
              </p>
            </td>
          </tr>

        </table>
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
  createHandler<PromoEmailBody>(async (_req, body) => {
    const { type, user_email, promo_code, discount_type, discount_value } = body

    if (!type || !user_email || !promo_code) {
      throw new Error('Missing required fields: type, user_email, promo_code')
    }

    console.log(`📧 Envoi email promo [${type}] à ${user_email}`)

    // Générer le HTML
    const html = generatePromoEmailHtml(body)

    // Générer le sujet
    const subject = getEmailSubject(type, discount_value, discount_type)

    // Envoyer l'email
    const result = await sendEmail({
      to: user_email,
      subject,
      html,
      type: `promo_${type}`,
    })

    console.log(`✅ Email promo envoyé: ${user_email}`)

    return {
      success: true,
      email_sent_to: user_email,
      promo_type: type,
      promo_code,
    }
  }),
)
