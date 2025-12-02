import { type Locale, getValidLocale, translations } from './i18n.ts'

export function getStatusMessage(
  status: string,
  carrier?: string,
  tracking_number?: string,
  locale?: string,
) {
  const validLocale: Locale = getValidLocale(locale)
  const t = translations.status
  const lower = status.toLowerCase()

  switch (lower) {
    case 'pending':
      return t.pending[validLocale]

    case 'confirmed':
      return t.confirmed[validLocale]

    case 'processing':
      return t.processing[validLocale]

    case 'shipped': {
      let trackingInfo = ''
      if (carrier || tracking_number) {
        const link =
          tracking_number && tracking_number.startsWith('http')
            ? `<a href="${tracking_number}" target="_blank">${tracking_number}</a>`
            : tracking_number || ''

        trackingInfo = `
          <div style="margin-top:10px;">
            ${carrier ? `<p><b>${t.carrierLabel[validLocale]} :</b> ${carrier}</p>` : ''}
            ${tracking_number ? `<p><b>${t.trackingLabel[validLocale]} :</b> ${link}</p>` : ''}
          </div>
        `
      }
      return `${t.shipped[validLocale]}${trackingInfo}`
    }

    case 'completed':
      return t.completed[validLocale]

    case 'canceled':
      return t.canceled[validLocale]

    default:
      return t.defaultUpdate[validLocale](status)
  }
}
