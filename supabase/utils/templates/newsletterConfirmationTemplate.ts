// supabase/utils/templates/newsletterConfirmationTemplate.ts

import { type Locale, translations } from '../i18n.ts'
import { APP_BASE_URL } from '../clients.ts'

interface NewsletterConfirmationParams {
  first_name?: string
  confirmation_url: string
  promo_code: string
  locale: Locale
}

export function newsletterConfirmationTemplate({
  first_name,
  confirmation_url,
  promo_code,
  locale,
}: NewsletterConfirmationParams): string {
  const t = translations.newsletterConfirmation
  const primary = '#00796B'
  const accent = '#00BFA5'
  const accentYellow = '#facc15'
  const promoRed = '#dc2626'

  const logoUrl =
    'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/email-icon/fast-peptides-logo.png'

  const greeting = first_name ? t.greeting[locale](first_name) : t.greetingDefault[locale]

  return `
<!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title[locale]}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <center style="width:100%;background-color:#f4f7fa;padding:40px 0;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

      <!-- Header -->
      <div style="background-color:${primary};padding:40px 20px;text-align:center;">
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
        <h1 style="margin-top:24px; margin-bottom:0; font-size:20px; font-weight:normal; color:#e0f2f1; letter-spacing:-0.5px;">
          ${t.title[locale]}
        </h1>
      </div>

      <!-- Content -->
      <div style="padding:40px 32px;color:#334155;line-height:1.6;font-size:16px;">

        <p style="margin:0 0 24px;">${greeting}</p>

        <p style="margin:0 0 24px;">${t.thankYou[locale]}</p>

        <!-- Promo Code Box -->
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px dashed ${promoRed}; border-radius:12px; padding:24px; text-align:center; margin:24px 0;">
          <p style="margin:0 0 8px; font-size:14px; color:#991b1b; text-transform:uppercase; letter-spacing:1px; font-weight:600;">
            ${t.yourPromoCode[locale]}
          </p>
          <p style="margin:0; font-size:32px; font-weight:900; color:${promoRed}; letter-spacing:2px;">
            ${promo_code}
          </p>
          <p style="margin:12px 0 0; font-size:14px; color:#b91c1c;">
            ${t.promoDescription[locale]}
          </p>
        </div>

        <p style="margin:24px 0; text-align:center; font-size:15px; color:#64748b;">
          ${t.confirmPrompt[locale]}
        </p>

        <!-- CTA Button -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="${confirmation_url}"
                 style="background:${primary};
                        color:#ffffff;
                        font-size:16px;
                        font-weight:bold;
                        padding:16px 40px;
                        border-radius:8px;
                        text-decoration:none;
                        display:inline-block;
                        mso-padding-alt:0;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                 <span style="mso-text-raise: 15pt;">${t.ctaConfirm[locale]}</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- What you'll receive -->
        <div style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:24px 0;">
          <p style="margin:0 0 16px; font-size:15px; font-weight:600; color:#1e293b;">
            ${t.whatYouGet[locale]}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0; font-size:14px; color:#475569;">
                <span style="color:${accent}; margin-right:8px;">&#10003;</span>
                ${t.benefit1[locale]}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-size:14px; color:#475569;">
                <span style="color:${accent}; margin-right:8px;">&#10003;</span>
                ${t.benefit2[locale]}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-size:14px; color:#475569;">
                <span style="color:${accent}; margin-right:8px;">&#10003;</span>
                ${t.benefit3[locale]}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-size:14px; color:#475569;">
                <span style="color:${accent}; margin-right:8px;">&#10003;</span>
                ${t.benefit4[locale]}
              </td>
            </tr>
          </table>
        </div>

        <p style="margin:24px 0 0; font-size:13px; color:#94a3b8; text-align:center;">
          ${t.ignoreIfNotYou[locale]}
        </p>

        <!-- Footer -->
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b;">
          <p style="margin:0 0 8px;">${translations.base.needHelp[locale]}</p>
          <p style="margin:0;">
            ${translations.base.teamSignature[locale]}<br/>
            <a href="${APP_BASE_URL}" style="color:${accent};text-decoration:none;">fp-store.com</a>
          </p>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="background-color:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        <p style="margin:0;">© ${new Date().getFullYear()} Atlas Lab Solutions LLC</p>
      </div>

    </div>
  </center>

</body>
</html>
  `
}
