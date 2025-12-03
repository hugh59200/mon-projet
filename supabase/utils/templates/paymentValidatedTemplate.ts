// supabase/functions/utils/templates/paymentValidatedTemplate.ts
// Template premium pour la validation de paiement (statut processing)

import { type Locale, translations } from '../i18n.ts'
import { APP_BASE_URL } from '../clients.ts'

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
  // Couleurs premium vertes pour succès
  const successPrimary = '#059669' // emerald-600
  const successLight = '#10b981' // emerald-500
  const successBg = '#ecfdf5' // emerald-50
  const successBorder = '#a7f3d0' // emerald-200
  const accentYellow = '#facc15'

  const logoUrl =
    'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/email-icon/fast-peptides-logo.png'

  const t = translations.paymentValidated
  const tBase = translations.base

  const greeting = full_name ? t.greeting[locale](full_name) : t.greetingDefault[locale]
  const paymentLabel = payment_method ? t.paymentMethodLabel[locale](payment_method) : ''

  const langAttr = locale === 'fr' ? 'fr' : 'en'

  return `
<!DOCTYPE html>
<html lang="${langAttr}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title[locale]}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <center style="width:100%;background-color:#f4f7fa;padding:40px 0;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- Header vert succès -->
      <div style="background: linear-gradient(135deg, ${successPrimary} 0%, ${successLight} 100%);padding:40px 20px;text-align:center;">

        <!-- Logo -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding-right: 12px; vertical-align: middle;">
              <img src="${logoUrl}" width="38" height="38" alt="FP Store" style="display:block; border:0; outline:none;" />
            </td>
            <td style="vertical-align: middle; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 26px; line-height: 1;">
              <span style="color:#ffffff; font-weight:900; font-style:italic; padding-right: 3px;">FP</span>
              <span style="color:${accentYellow}; font-weight:600; letter-spacing:1px;">Store</span>
            </td>
          </tr>
        </table>

        <!-- Icône checkmark animée -->
        <div style="margin-top:24px;">
          <div style="display:inline-block;width:64px;height:64px;background:#ffffff;border-radius:50%;line-height:64px;text-align:center;">
            <span style="font-size:32px;color:${successPrimary};">✓</span>
          </div>
        </div>

        <h1 style="margin-top:20px; margin-bottom:0; font-size:24px; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">
          ${t.title[locale]}
        </h1>
      </div>

      <!-- Corps du message -->
      <div style="padding:40px 32px;color:#334155;line-height:1.7;font-size:16px;">

        <!-- Salutation -->
        <p style="margin:0 0 20px;font-size:17px;">
          ${greeting}
        </p>

        <!-- Message principal dans une box verte -->
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

        <!-- CTA Button -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="${ctaUrl}"
                 style="background:${successPrimary};
                        color:#ffffff;
                        font-size:16px;
                        font-weight:bold;
                        padding:16px 40px;
                        border-radius:10px;
                        text-decoration:none;
                        display:inline-block;
                        mso-padding-alt:0;
                        box-shadow: 0 4px 14px rgba(5,150,105,0.35);">
                 <span style="mso-text-raise: 15pt;">${t.ctaLabel[locale]}</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b;">
          <p style="margin:0 0 8px;">${tBase.needHelp[locale]}</p>
          <p style="margin:0;">
            ${tBase.teamSignature[locale]}<br/>
            <a href="${APP_BASE_URL}" style="color:${successLight};text-decoration:none;">fp-store.com</a>
          </p>
        </div>
      </div>

      <!-- Bottom bar -->
      <div style="background-color:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        <p style="margin:0;">© ${new Date().getFullYear()} Atlas Lab Solutions LLC</p>
      </div>

    </div>
  </center>

</body>
</html>
  `
}
