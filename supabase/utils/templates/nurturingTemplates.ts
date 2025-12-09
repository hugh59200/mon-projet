// supabase/utils/templates/nurturingTemplates.ts
// Templates pour la séquence email éducative (nurturing)

import { type Locale, translations } from '../i18n.ts'
import { APP_BASE_URL } from '../clients.ts'

interface NurturingParams {
  locale: Locale
  optout_url: string
  article_url: string
}

// Couleurs du design system
const primary = '#00796B'
const accent = '#00BFA5'
const accentYellow = '#facc15'
const logoUrl =
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/email-icon/fast-peptides-logo.png'

/**
 * Template de base pour les emails nurturing
 */
function baseNurturingTemplate({
  locale,
  title,
  subtitle,
  intro,
  keyPoints,
  ctaLabel,
  ctaUrl,
  optoutUrl,
}: {
  locale: Locale
  title: string
  subtitle: string
  intro: string
  keyPoints: string[]
  ctaLabel: string
  ctaUrl: string
  optoutUrl: string
}): string {
  const t = translations.nurturing

  return `
<!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
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
        <p style="margin-top:20px; margin-bottom:0; font-size:12px; color:#b2dfdb; text-transform:uppercase; letter-spacing:2px;">
          ${t.seriesLabel[locale]}
        </p>
        <h1 style="margin-top:8px; margin-bottom:0; font-size:22px; font-weight:600; color:#ffffff; letter-spacing:-0.5px;">
          ${title}
        </h1>
      </div>

      <!-- Content -->
      <div style="padding:40px 32px;color:#334155;line-height:1.6;font-size:16px;">

        <p style="margin:0 0 8px; font-size:14px; color:${accent}; text-transform:uppercase; letter-spacing:1px; font-weight:600;">
          ${subtitle}
        </p>

        <p style="margin:0 0 24px; font-size:16px; color:#475569;">
          ${intro}
        </p>

        <!-- Key Points Box -->
        <div style="background-color:#f0fdfa; border-left:4px solid ${accent}; border-radius:0 8px 8px 0; padding:20px; margin:24px 0;">
          <p style="margin:0 0 12px; font-size:14px; font-weight:600; color:#0f766e;">
            ${t.keyPointsTitle[locale]}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${keyPoints
              .map(
                (point) => `
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#475569;">
                <span style="color:${accent}; margin-right:10px;">&#8226;</span>
                ${point}
              </td>
            </tr>
            `
              )
              .join('')}
          </table>
        </div>

        <!-- CTA Button -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="${ctaUrl}"
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
                 <span style="mso-text-raise: 15pt;">${ctaLabel}</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b;">
          <p style="margin:0 0 8px;">${translations.base.needHelp[locale]}</p>
          <p style="margin:0;">
            ${translations.base.teamSignature[locale]}<br/>
            <a href="${APP_BASE_URL}" style="color:${accent};text-decoration:none;">fp-store.com</a>
          </p>
        </div>
      </div>

      <!-- Bottom Footer with Opt-out -->
      <div style="background-color:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        <p style="margin:0 0 8px;">© ${new Date().getFullYear()} Atlas Lab Solutions LLC</p>
        <p style="margin:0;">
          ${t.optoutText[locale]}
          <a href="${optoutUrl}" style="color:#64748b; text-decoration:underline;">${t.optoutLink[locale]}</a>
        </p>
      </div>

    </div>
  </center>

</body>
</html>
  `
}

/**
 * Step 1: Comment lire un rapport HPLC ? (J+2)
 */
export function nurturingStep1Template({ locale, optout_url, article_url }: NurturingParams): string {
  const t = translations.nurturing.step1

  return baseNurturingTemplate({
    locale,
    title: t.title[locale],
    subtitle: t.subtitle[locale],
    intro: t.intro[locale],
    keyPoints: [t.point1[locale], t.point2[locale], t.point3[locale], t.point4[locale]],
    ctaLabel: t.ctaLabel[locale],
    ctaUrl: article_url,
    optoutUrl: optout_url,
  })
}

/**
 * Step 2: Eau stérile vs Bactériostatique (J+5)
 */
export function nurturingStep2Template({ locale, optout_url, article_url }: NurturingParams): string {
  const t = translations.nurturing.step2

  return baseNurturingTemplate({
    locale,
    title: t.title[locale],
    subtitle: t.subtitle[locale],
    intro: t.intro[locale],
    keyPoints: [t.point1[locale], t.point2[locale], t.point3[locale], t.point4[locale]],
    ctaLabel: t.ctaLabel[locale],
    ctaUrl: article_url,
    optoutUrl: optout_url,
  })
}

/**
 * Step 3: Notre garantie livraison (J+9)
 */
export function nurturingStep3Template({ locale, optout_url, article_url }: NurturingParams): string {
  const t = translations.nurturing.step3

  return baseNurturingTemplate({
    locale,
    title: t.title[locale],
    subtitle: t.subtitle[locale],
    intro: t.intro[locale],
    keyPoints: [t.point1[locale], t.point2[locale], t.point3[locale], t.point4[locale]],
    ctaLabel: t.ctaLabel[locale],
    ctaUrl: article_url,
    optoutUrl: optout_url,
  })
}
