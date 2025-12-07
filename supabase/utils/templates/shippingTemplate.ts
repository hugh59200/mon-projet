import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, pluralizeItem, translations } from '../i18n.ts'
import { EMAIL_ASSETS } from '../emailAssets.ts'

export function shippingTemplate({
  order_number,
  full_name,
  item_count,
  carrier,
  tracking_number,
  tracking_url,
  ctaUrl,
  locale = 'en',
}: {
  order_number: string
  full_name?: string
  item_count: number
  carrier?: string
  tracking_number?: string
  tracking_url?: string
  ctaUrl: string
  locale?: Locale
}) {
  const t = translations.shipping

  // URL de suivi : priorité au tracking_url fourni, sinon La Poste par défaut
  const finalTrackingUrl = tracking_url ||
    (tracking_number
      ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking_number}`
      : ctaUrl)

  // Pluralisation
  const itemLabel = pluralizeItem(item_count, locale)

  const trackingBlock = tracking_number
    ? `
      <div style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:24px; margin:24px 0; text-align:center;">
        <p style="margin:0 0 8px; color:#166534; font-size:14px; font-weight:600; text-transform:uppercase;">
          ${t.trackingInfo[locale]}
        </p>
        <p style="margin:0 0 4px; color:#64748b; font-size:14px;">
          ${t.carrier[locale]} : <strong style="color:#14532d;">${carrier || t.standard[locale]}</strong>
        </p>
        <p style="margin:0; font-family:monospace; font-size:20px; font-weight:700; color:#14532d; letter-spacing:1px;">
          ${tracking_number}
        </p>
      </div>
    `
    : `
      <div style="background-color:#fef3c7; border:1px solid #fde68a; border-radius:12px; padding:20px; margin:24px 0; text-align:center;">
        <p style="margin:0; color:#92400e; font-size:14px;">
          ${t.trackingPending[locale]}
        </p>
      </div>
    `

  const bodyHTML = `
    <p>${t.greeting[locale](full_name || '')}</p>

    <p>
      ${t.shipped[locale](order_number)}
    </p>

    <div style="margin: 24px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
        ${t.packageContents[locale]}
      </p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: #0f172a;">
        ${item_count} ${itemLabel}
      </p>
    </div>

    ${trackingBlock}

    <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #92400e; margin: 0 0 12px;">
        ⚠️ ${t.storageTipsTitle[locale]}
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #78350f;">
        <li style="margin-bottom: 6px;">${t.storageTip1[locale]}</li>
        <li style="margin-bottom: 6px;">${t.storageTip2[locale]}</li>
        <li style="margin-bottom: 6px;">${t.storageTip3[locale]}</li>
      </ul>
    </div>

    <p style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #475569;">
      ${t.viewOrderDetails[locale]}
    </p>
  `

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML,
    ctaLabel: tracking_number ? t.ctaTrackPackage[locale] : t.ctaViewOrder[locale],
    ctaUrl: tracking_number ? finalTrackingUrl : ctaUrl,
    heroImage: EMAIL_ASSETS['shipping'],
    locale,
  })
}
