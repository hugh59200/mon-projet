import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'
import { EMAIL_ASSETS } from '../emailAssets.ts'
import { APP_BASE_URL } from '../clients.ts'

export function welcomeTemplate({
  full_name,
  locale = 'fr',
}: {
  full_name?: string
  locale?: Locale
}) {
  const t = translations.welcome

  const bodyHTML = `
    <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">
      ${t.greeting[locale](full_name || '')}
    </p>

    <p style="font-size: 15px; color: #475569; margin-bottom: 32px;">
      ${t.accountActive[locale]}
    </p>

    <!-- Features Grid - 3 colonnes -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
      <tr>
        <!-- Feature 1: Historique -->
        <td width="33%" style="text-align: center; vertical-align: top; padding: 0 8px;">
          <img src="${EMAIL_ASSETS['welcome-history']}" width="64" height="64" alt="" style="display: block; margin: 0 auto 12px;" />
          <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #0f172a;">
            ${t.benefit1Title[locale]}
          </p>
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
            ${t.benefit1Desc[locale]}
          </p>
        </td>

        <!-- Feature 2: Lots -->
        <td width="33%" style="text-align: center; vertical-align: top; padding: 0 8px;">
          <img src="${EMAIL_ASSETS['welcome-batch']}" width="64" height="64" alt="" style="display: block; margin: 0 auto 12px;" />
          <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #0f172a;">
            ${t.benefit2Title[locale]}
          </p>
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
            ${t.benefit2Desc[locale]}
          </p>
        </td>

        <!-- Feature 3: Recommande -->
        <td width="33%" style="text-align: center; vertical-align: top; padding: 0 8px;">
          <img src="${EMAIL_ASSETS['welcome-reorder']}" width="64" height="64" alt="" style="display: block; margin: 0 auto 12px;" />
          <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #0f172a;">
            ${t.benefit3Title[locale]}
          </p>
          <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
            ${t.benefit3Desc[locale]}
          </p>
        </td>
      </tr>
    </table>

    <!-- Separator -->
    <div style="border-top: 1px solid #e2e8f0; margin: 32px 0;"></div>

    <!-- RUO Notice -->
    <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; font-size: 13px; color: #854d0e; line-height: 1.5;">
        <strong>${t.ruoTitle[locale]}</strong><br/>
        ${t.ruoMessage[locale]}
      </p>
    </div>

    <p style="font-size: 15px; color: #475569; margin-top: 24px;">
      ${t.closing[locale]}
    </p>
  `

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML,
    ctaLabel: t.ctaLabel[locale],
    ctaUrl: `${APP_BASE_URL}/catalogue`,
    heroImage: EMAIL_ASSETS['welcome'],
    locale,
  })
}
