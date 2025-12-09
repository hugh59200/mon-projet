// supabase/functions/send-cart-reminder-email/index.ts
// Edge Function pour envoyer l'email de rappel doux (sans code promo)
// Ton serviable, focus sur l'aide technique

import { APP_BASE_URL } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { baseEmailTemplate } from '../../utils/templates/baseEmailTemplate.ts'
import { EMAIL_ASSETS } from '../../utils/emailAssets.ts'

interface ReminderEmailBody {
  user_email: string
  first_name?: string | null
  cart_value: number
  items_count: number
  locale?: 'fr' | 'en'
}

// ============================================================
// TRADUCTIONS
// ============================================================

const translations = {
  fr: {
    subject: 'Vos recherches vous attendent...',
    title: 'Vos recherches vous attendent',
    greeting: (name: string | null) => (name ? `Bonjour <strong>${name}</strong>,` : 'Bonjour,'),
    cartNotice: (count: number, total: string) =>
      `Nous avons remarqué que vous avez laissé <strong>${count} article${count > 1 ? 's' : ''}</strong> dans votre panier pour un total de <strong>${total} EUR</strong>.`,
    waitingText: 'Vos recherches sont en attente et nous voulons nous assurer que tout se passe bien de votre côté.',
    helpTitle: 'Besoin d\'aide ?',
    helpItems: [
      'Un problème technique lors du paiement crypto ?',
      'Des questions sur un produit ?',
      'Besoin de conseils sur le dosage ou le stockage ?',
    ],
    supportText:
      'Notre équipe est là pour vous accompagner. N\'hésitez pas à nous contacter si vous avez la moindre question.',
    ctaLabel: 'Reprendre mon panier',
  },
  en: {
    subject: 'Your research is waiting...',
    title: 'Your research is waiting',
    greeting: (name: string | null) => (name ? `Hello <strong>${name}</strong>,` : 'Hello,'),
    cartNotice: (count: number, total: string) =>
      `We noticed you left <strong>${count} item${count > 1 ? 's' : ''}</strong> in your cart for a total of <strong>${total} EUR</strong>.`,
    waitingText: 'Your research is waiting and we want to make sure everything is going well on your end.',
    helpTitle: 'Need help?',
    helpItems: [
      'Technical issue with crypto payment?',
      'Questions about a product?',
      'Need advice on dosage or storage?',
    ],
    supportText:
      'Our team is here to help. Don\'t hesitate to contact us if you have any questions.',
    ctaLabel: 'Continue shopping',
  },
}

// ============================================================
// TEMPLATE
// ============================================================

function generateReminderEmailHtml(data: ReminderEmailBody): string {
  const locale = data.locale || 'fr'
  const t = translations[locale]

  const greeting = t.greeting(data.first_name || null)
  const cartNotice = t.cartNotice(data.items_count, data.cart_value.toFixed(2))

  const helpItemsHtml = t.helpItems.map((item) => `<li>${item}</li>`).join('')

  const bodyText = `
    ${greeting}

    <p style="margin-top: 16px;">
      ${cartNotice}
    </p>

    <p>${t.waitingText}</p>

    <div style="background: #f8fafc; border-left: 4px solid #00796B; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #334155;">${t.helpTitle}</p>
      <ul style="margin: 0; padding-left: 20px; color: #475569;">
        ${helpItemsHtml}
      </ul>
    </div>

    <p>${t.supportText}</p>
  `

  return baseEmailTemplate({
    title: t.title,
    bodyHTML: bodyText,
    ctaLabel: t.ctaLabel,
    ctaUrl: `${APP_BASE_URL}/panier`,
    heroImage: EMAIL_ASSETS['cart-abandoned'],
    locale,
  })
}

// ============================================================
// HANDLER
// ============================================================

Deno.serve(
  createHandler<ReminderEmailBody>(async (_req, body) => {
    const { user_email, first_name, cart_value, items_count, locale = 'fr' } = body

    if (!user_email) {
      throw new Error('Missing required field: user_email')
    }

    console.log(`📧 Envoi rappel doux à ${user_email} (${items_count} articles, ${cart_value}€)`)

    const t = translations[locale]
    const html = generateReminderEmailHtml(body)

    await sendEmail({
      to: user_email,
      subject: t.subject,
      html,
      type: 'cart_reminder',
    })

    return {
      success: true,
      email_sent_to: user_email,
      items_count,
      cart_value,
    }
  }),
)
