import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, formatDate, pluralizeItem, translations } from '../i18n.ts'

export function orderConfirmationTemplate({
  order_number,
  full_name,
  item_count,
  subtotal,
  shipping_cost,
  total_amount,
  created_at,
  ctaLabel,
  ctaUrl,
  shipping_address,
  relay_name,
  locale = 'en',
}: {
  order_number: string
  full_name?: string
  item_count: number
  subtotal?: number
  shipping_cost?: number
  total_amount: number
  created_at: string
  ctaLabel: string
  ctaUrl: string
  shipping_address?: string
  relay_name?: string
  locale?: Locale
}) {
  const t = translations.confirmation

  // Gestion affichage livraison
  const shippingLabel =
    !shipping_cost || shipping_cost === 0 ? t.free[locale] : `${shipping_cost.toFixed(2)} €`

  // Calcul sous-total fallback
  const subtotalDisplay = subtotal ? subtotal.toFixed(2) : (total_amount - (shipping_cost || 0)).toFixed(2)

  // Formatage de la date selon la locale
  const formattedDate = formatDate(created_at, locale)

  // Info livraison (Point Relais ou adresse)
  const deliveryInfo = relay_name
    ? `<p style="margin:8px 0;"><strong>${t.pickupPoint[locale]} :</strong> ${relay_name}</p>`
    : shipping_address
      ? `<p style="margin:8px 0;"><strong>${t.address[locale]} :</strong> ${shipping_address}</p>`
      : ''

  // Pluralisation
  const itemLabel = pluralizeItem(item_count, locale)

  const bodyHTML = `
    <p>${t.greeting[locale](full_name || '')}</p>

    <p>
      ${t.orderReceived[locale](order_number, formattedDate)}
    </p>

    <div style="margin: 24px 0; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #166534; text-transform: uppercase; font-weight: 600;">
        ${t.yourOrder[locale]}
      </p>
      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #14532d;">
        ${item_count} ${itemLabel}
      </p>
    </div>

    <div style="margin: 24px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
      <table style="width:100%; font-size:14px;">
        <tr>
          <td style="padding-bottom:8px; color:#64748b;">${t.subtotal[locale]}</td>
          <td style="text-align:right; padding-bottom:8px; color:#1e293b;">${subtotalDisplay} €</td>
        </tr>
        <tr>
          <td style="padding-bottom:8px; color:#64748b;">${t.shipping[locale]}</td>
          <td style="text-align:right; padding-bottom:8px; color:#1e293b;">${shippingLabel}</td>
        </tr>
        <tr>
          <td style="padding-top:12px; border-top: 1px solid #e2e8f0; font-weight:700; font-size:18px; color:#0f172a;">${t.total[locale]}</td>
          <td style="text-align:right; padding-top:12px; border-top: 1px solid #e2e8f0; font-weight:700; font-size:18px; color:#00796B;">
            ${total_amount.toFixed(2)} €
          </td>
        </tr>
      </table>
    </div>

    ${deliveryInfo}

    <p style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #475569;">
      ${t.viewDetails[locale]}
    </p>

    <p style="margin-top: 24px;">
      ${t.trackingEmailNotice[locale]}
    </p>
  `

  return baseEmailTemplate({
    title: t.title[locale](order_number),
    bodyHTML,
    ctaLabel,
    ctaUrl,
    locale,
  })
}
