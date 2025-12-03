// supabase/utils/templates/pendingPaymentTemplate.ts

import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'

export type PaymentMethod = 'bank_transfer' | 'crypto'

export interface OrderItem {
  quantity: number
  unit_price: number
}

export interface BankTransferDetails {
  beneficiary: string
  iban: string
  bic: string
}

export interface CryptoDetails {
  btc_address: string
  usdt_address: string
}

export function pendingPaymentTemplate({
  order_number,
  full_name,
  payment_method,
  items,
  subtotal,
  shipping_cost,
  total_amount,
  bank_details,
  crypto_details,
  ctaUrl,
  locale = 'en',
}: {
  order_number: string
  full_name?: string
  payment_method: PaymentMethod
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  total_amount: number
  bank_details?: BankTransferDetails
  crypto_details?: CryptoDetails
  ctaUrl: string
  locale?: Locale
}) {
  const t = translations.pendingPayment
  const primary = '#00796B'

  // Gestion affichage livraison
  const shippingLabel = !shipping_cost || shipping_cost === 0 ? t.free[locale] : `${shipping_cost.toFixed(2)} €`

  // Calcul du nombre total d'articles (sans afficher les noms - OpSec)
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  // Bloc instructions de paiement - Virement bancaire
  const bankTransferBlock =
    payment_method === 'bank_transfer' && bank_details
      ? `
      <div style="margin:24px 0;background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:24px;">
        <h3 style="margin:0 0 16px;font-size:16px;color:#0369a1;font-weight:600;">
          ${t.bankTransferTitle[locale]}
        </h3>

        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:140px;">${t.beneficiary[locale]}</td>
            <td style="padding:8px 0;color:#1e293b;font-weight:500;">${bank_details.beneficiary}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;">${t.iban[locale]}</td>
            <td style="padding:8px 0;color:#1e293b;font-family:monospace;font-size:13px;letter-spacing:0.5px;">${bank_details.iban}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;">${t.bic[locale]}</td>
            <td style="padding:8px 0;color:#1e293b;font-family:monospace;">${bank_details.bic}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#64748b;vertical-align:top;">${t.reference[locale]}</td>
            <td style="padding:12px 0;">
              <span style="display:inline-block;background:${primary};color:#ffffff;font-weight:700;padding:8px 16px;border-radius:6px;font-family:monospace;font-size:15px;letter-spacing:1px;">
                ${order_number}
              </span>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;line-height:1.5;">
          ${t.referenceWarning[locale]}
        </p>
      </div>
    `
      : ''

  // Bloc instructions de paiement - Crypto
  const cryptoBlock =
    payment_method === 'crypto' && crypto_details
      ? `
      <div style="margin:24px 0;background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:24px;">
        <h3 style="margin:0 0 16px;font-size:16px;color:#7c3aed;font-weight:600;">
          ${t.cryptoTitle[locale]}
        </h3>

        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:140px;">${t.btcAddress[locale]}</td>
            <td style="padding:8px 0;color:#1e293b;font-family:monospace;font-size:12px;word-break:break-all;">${crypto_details.btc_address}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;">${t.usdtAddress[locale]}</td>
            <td style="padding:8px 0;color:#1e293b;font-family:monospace;font-size:12px;word-break:break-all;">${crypto_details.usdt_address}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#64748b;vertical-align:top;">${t.amountToPay[locale]}</td>
            <td style="padding:12px 0;">
              <span style="display:inline-block;background:#7c3aed;color:#ffffff;font-weight:700;padding:8px 16px;border-radius:6px;font-size:18px;">
                ${total_amount.toFixed(2)} €
              </span>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;line-height:1.5;">
          ${t.cryptoWarning[locale]}
        </p>
      </div>
    `
      : ''

  const bodyHTML = `
    <p>${t.greeting[locale](full_name || '')}</p>

    <p>${t.orderRegistered[locale](order_number)}</p>

    <!-- Bloc Instructions de paiement -->
    <h2 style="margin:32px 0 16px;font-size:18px;color:#1e293b;font-weight:600;border-bottom:2px solid ${primary};padding-bottom:8px;">
      ${t.paymentInstructions[locale]}
    </h2>

    ${bankTransferBlock}
    ${cryptoBlock}

    <!-- Récapitulatif de la commande (OpSec: pas de noms de produits) -->
    <h2 style="margin:32px 0 16px;font-size:18px;color:#1e293b;font-weight:600;border-bottom:2px solid ${primary};padding-bottom:8px;">
      ${t.orderSummary[locale]}
    </h2>

    <div style="margin:24px 0;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <!-- Nombre d'articles -->
      <div style="padding:20px;text-align:center;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-size:14px;color:#166534;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">
          ${t.quantity[locale]}
        </p>
        <p style="margin:8px 0 0;font-size:32px;font-weight:700;color:#14532d;">
          ${totalItemCount} ${totalItemCount > 1 ? t.itemPlural[locale] : t.itemSingular[locale]}
        </p>
      </div>

      <!-- Totaux -->
      <div style="padding:16px;background:#f8fafc;">
        <table style="width:100%;font-size:14px;">
          <tr>
            <td style="padding:4px 0;color:#64748b;">${t.subtotal[locale]}</td>
            <td style="padding:4px 0;text-align:right;color:#1e293b;">${subtotal.toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#64748b;">${t.shipping[locale]}</td>
            <td style="padding:4px 0;text-align:right;color:#1e293b;">${shippingLabel}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;font-weight:700;font-size:18px;color:#0f172a;border-top:1px solid #e2e8f0;">${t.total[locale]}</td>
            <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:18px;color:${primary};border-top:1px solid #e2e8f0;">
              ${total_amount.toFixed(2)} €
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Avertissement expiration -->
    <p style="margin:24px 0;padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:14px;color:#991b1b;text-align:center;">
      ${t.expirationNotice[locale]}
    </p>
  `

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML,
    ctaLabel: t.ctaViewOrder[locale],
    ctaUrl,
    locale,
  })
}
