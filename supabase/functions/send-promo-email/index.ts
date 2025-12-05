// supabase/functions/send-promo-email/index.ts
// Edge Function pour envoyer les emails de codes promo automatiques

import { APP_BASE_URL } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { baseEmailTemplate } from '../../utils/templates/baseEmailTemplate.ts'
import { EMAIL_ASSETS } from '../../utils/emailAssets.ts'

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

function getHeroImage(type: string): string {
  switch (type) {
    case 'welcome':
      return EMAIL_ASSETS['welcome']
    case 'loyalty':
      return EMAIL_ASSETS['loyalty']
    case 'cart_abandonment':
      return EMAIL_ASSETS['cart-abandoned']
    default:
      return EMAIL_ASSETS['welcome']
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

  let title: string
  let bodyText: string

  switch (data.type) {
    case 'welcome':
      title = 'Bienvenue chez FP Store !'
      bodyText = `
        <p>Nous sommes ravis de vous compter parmi nous !</p>
        <p>Pour célébrer votre inscription, voici un code promo exclusif de <strong>${discountText}</strong>
        sur votre première commande.</p>
      `
      break

    case 'loyalty':
      title = 'Merci pour votre fidélité !'
      bodyText = `
        <p>Vous avez passé <strong>${data.orders_count ?? 0} commandes</strong> chez nous.</p>
        <p>Pour vous remercier de votre confiance, voici un code promo de <strong>${discountText}</strong>.</p>
      `
      break

    case 'cart_abandonment':
      title = 'Vous avez oublié quelque chose ?'
      bodyText = `
        <p>Nous avons remarqué que vous aviez des articles dans votre panier${data.cart_value ? ` d'une valeur de <strong>${data.cart_value.toFixed(2)}€</strong>` : ''}.</p>
        <p>Pour vous aider à finaliser votre commande, voici un code promo de <strong>${discountText}</strong>.</p>
      `
      break

    default:
      title = 'Code promo pour vous'
      bodyText = `<p>Voici un code promo de <strong>${discountText}</strong> à utiliser sur votre prochaine commande.</p>`
  }

  // Bloc code promo
  const promoCodeBlock = `
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #22c55e; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 500;">Votre code promo</p>
      <p style="margin: 0; color: #15803d; font-size: 32px; font-weight: 700; letter-spacing: 2px; font-family: 'SF Mono', 'Fira Code', monospace;">${data.promo_code}</p>
      <p style="margin: 8px 0 0; color: #16a34a; font-size: 20px; font-weight: 600;">${discountText}</p>
    </div>
    ${expiresText ? `<p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; text-align: center;">Valable jusqu'au <strong>${expiresText}</strong></p>` : ''}
    <p style="margin: 16px 0 0; color: #9ca3af; font-size: 13px; text-align: center;">
      Entrez ce code lors du paiement pour bénéficier de votre remise.
    </p>
  `

  return baseEmailTemplate({
    title,
    bodyHTML: bodyText + promoCodeBlock,
    ctaLabel: 'Découvrir le catalogue',
    ctaUrl: `${APP_BASE_URL}/catalogue`,
    heroImage: getHeroImage(data.type),
    locale: 'fr',
  })
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

    return {
      success: true,
      email_sent_to: user_email,
      promo_type: type,
      promo_code,
    }
  }),
)
