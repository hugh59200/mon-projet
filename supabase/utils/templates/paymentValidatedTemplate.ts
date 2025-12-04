// supabase/utils/templates/paymentValidatedTemplate.ts
// Template pour la confirmation de paiement validé par l'admin (statut processing)

import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'

export function paymentValidatedTemplate({
  order_number,
  full_name,
  total_amount,
  payment_method,
  ctaUrl,
  locale = 'fr',
}: {
  order_number: string
  full_name?: string
  total_amount: number
  payment_method?: string
  ctaUrl: string
  locale?: Locale
}) {
  const t = translations.paymentValidated

  // Couleurs pour les éléments de succès dans le body
  const successPrimary = '#059669' // emerald-600
  const successBg = '#ecfdf5' // emerald-50
  const successBorder = '#a7f3d0' // emerald-200

  const greeting = full_name ? t.greeting[locale](full_name) : t.greetingDefault[locale]

  const getPaymentMethodLabel = (method?: string): string => {
    if (!method) return ''
    return t.paymentMethodLabel[locale](method)
  }

  const paymentLabel = getPaymentMethodLabel(payment_method)

  const bodyHTML = `
    <!-- Salutation -->
    <p style="margin:0 0 20px;font-size:17px;">
      ${greeting}
    </p>

    <!-- Message principal dans une box verte de succès -->
    <div style="background:${successBg};border:1px solid ${successBorder};border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:16px;color:#065f46;font-weight:600;">
        ✅ ${t.confirmationTitle[locale]}
      </p>
      <p style="margin:0;font-size:15px;color:#047857;">
        ${t.confirmationMessage[locale]}
      </p>
    </div>

    <!-- Détails de la commande -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#f8fafc;padding:16px 20px;border-bottom:1px solid #e2e8f0;">
          <span style="font-weight:600;color:#334155;font-size:15px;">${t.orderDetails[locale]}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;color:#64748b;font-size:14px;">${t.orderNumber[locale]}</td>
              <td style="padding:8px 0;text-align:right;font-weight:600;color:#334155;font-size:14px;">#${order_number}</td>
            </tr>
            ${paymentLabel ? `
            <tr>
              <td style="padding:8px 0;color:#64748b;font-size:14px;">${t.paymentMethod[locale]}</td>
              <td style="padding:8px 0;text-align:right;font-weight:600;color:#334155;font-size:14px;">${paymentLabel}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:12px 0 0;border-top:1px dashed #e2e8f0;color:#64748b;font-size:14px;">${t.amountReceived[locale]}</td>
              <td style="padding:12px 0 0;border-top:1px dashed #e2e8f0;text-align:right;font-weight:700;color:${successPrimary};font-size:18px;">${total_amount.toFixed(2)} €</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Prochaines étapes -->
    <div style="margin-bottom:28px;">
      <p style="margin:0 0 12px;font-weight:600;color:#334155;font-size:15px;">
        🚀 ${t.nextStepsTitle[locale]}
      </p>
      <ul style="margin:0;padding-left:20px;color:#64748b;font-size:14px;line-height:1.8;">
        <li style="margin-bottom:6px;">${t.step1[locale]}</li>
        <li style="margin-bottom:6px;">${t.step2[locale]}</li>
        <li>${t.step3[locale]}</li>
      </ul>
    </div>
  `

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML,
    ctaLabel: t.ctaLabel[locale],
    ctaUrl,
    locale,
  })
}
