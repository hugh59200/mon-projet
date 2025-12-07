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
    <p>${t.greeting[locale](full_name || '')}</p>

    <p>${t.accountActive[locale]}</p>

    <div style="margin: 24px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #166534;">
        ${t.welcomeTitle[locale]}
      </p>
      <p style="margin: 0; font-size: 14px; color: #15803d;">
        ${t.welcomeSubtitle[locale]}
      </p>
    </div>

    <p style="font-weight: 600; margin-bottom: 16px; color: #1e293b;">${t.benefitsTitle[locale]}</p>

    <div style="margin: 0 0 24px;">
      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; background: #e0f2fe; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 12px; flex-shrink: 0;">
          📦
        </div>
        <div>
          <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${t.benefit1Title[locale]}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${t.benefit1Desc[locale]}</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; background: #fef3c7; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 12px; flex-shrink: 0;">
          🔬
        </div>
        <div>
          <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${t.benefit2Title[locale]}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${t.benefit2Desc[locale]}</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; background: #f0fdf4; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 12px; flex-shrink: 0;">
          🔄
        </div>
        <div>
          <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${t.benefit3Title[locale]}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${t.benefit3Desc[locale]}</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start;">
        <div style="width: 32px; height: 32px; background: #fce7f3; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 12px; flex-shrink: 0;">
          💬
        </div>
        <div>
          <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${t.benefit4Title[locale]}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${t.benefit4Desc[locale]}</p>
        </div>
      </div>
    </div>

    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 12px; font-weight: 600; color: #334155;">${t.quickLinksTitle[locale]}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0;">
            <a href="${APP_BASE_URL}/catalogue" style="color: #00796B; text-decoration: none; font-weight: 500;">
              → ${t.linkCatalogue[locale]}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <a href="${APP_BASE_URL}/profil" style="color: #00796B; text-decoration: none; font-weight: 500;">
              → ${t.linkProfile[locale]}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <a href="${APP_BASE_URL}/faq" style="color: #00796B; text-decoration: none; font-weight: 500;">
              → ${t.linkFaq[locale]}
            </a>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border: 1px solid #fde047; border-radius: 12px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-size: 13px; color: #854d0e;">
        <strong>⚗️ ${t.ruoTitle[locale]}</strong><br/>
        ${t.ruoMessage[locale]}
      </p>
    </div>

    <p style="margin-top: 24px;">
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
