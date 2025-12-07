// supabase/functions/utils/templates/renderEmailTemplate.ts

import { APP_BASE_URL } from '../clients.ts'
import { type Locale, getValidLocale, translations } from '../i18n.ts'
import { accountDeletedTemplate } from './accountDeletedTemplate.ts'
import { emailChangeTemplate } from './emailChangeTemplate.ts'
import { genericTemplate } from './genericTemplate.ts'
import { orderConfirmationTemplate } from './orderConfirmationTemplate.ts'
import {
  pendingPaymentTemplate,
  type PaymentMethod,
  type OrderItem,
  type BankTransferDetails,
  type CryptoDetails,
} from './pendingPaymentTemplate.ts'
import { recoveryTemplate } from './recoveryTemplate.ts'
import { shippingTemplate } from './shippingTemplate.ts'
import { signupConfirmationTemplate } from './signupConfirmationTemplate.ts'
import { paymentValidatedTemplate } from './paymentValidatedTemplate.ts'
import { statusUpdateTemplate } from './statusUpdateTemplate.ts'
import { welcomeTemplate } from './welcomeTemplate.ts'

// Type générique pour les données d'email
// deno-lint-ignore no-explicit-any
type EmailData = Record<string, any>

export function renderEmailTemplate(type: string, data: EmailData): string {
  // Validation de la locale avec fallback EN
  const locale: Locale = getValidLocale(data.locale)

  switch (type) {
    case 'confirmation': {
      return orderConfirmationTemplate({
        order_number: data.order_number,
        full_name: data.full_name,
        item_count: data.item_count,
        subtotal: data.subtotal,
        shipping_cost: data.shipping_cost,
        total_amount: data.total_amount,
        created_at: data.created_at,
        shipping_address: data.shipping_address,
        relay_name: data.relay_name,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        locale,
      })
    }

    case 'pending_payment': {
      return pendingPaymentTemplate({
        order_number: data.order_number,
        full_name: data.full_name,
        payment_method: data.payment_method as PaymentMethod,
        items: data.items as OrderItem[],
        subtotal: data.subtotal,
        shipping_cost: data.shipping_cost,
        total_amount: data.total_amount,
        bank_details: data.bank_details as BankTransferDetails | undefined,
        crypto_details: data.crypto_details as CryptoDetails | undefined,
        ctaUrl: data.ctaUrl,
        locale,
      })
    }

    case 'shipping': {
      return shippingTemplate({
        order_number: data.order_number,
        full_name: data.full_name,
        item_count: data.item_count,
        carrier: data.carrier,
        tracking_number: data.tracking_number,
        tracking_url: data.tracking_url,
        ctaUrl: data.ctaUrl,
        locale,
      })
    }

    case 'payment': {
      const t = translations.payment
      return genericTemplate({
        title: t.title[locale],
        message: t.received[locale]((Number(data.amount) || 0).toFixed(2)),
        ctaLabel: t.ctaViewOrder[locale],
        ctaUrl: `${APP_BASE_URL}/profil/commandes/${data.order_id}`,
        locale,
      })
    }

    case 'status_update': {
      const t = translations.statusUpdate
      const displayId = data.order_number ?? String(data.order_id).slice(0, 8)
      const ctaUrl = data.ctaUrl ?? `${APP_BASE_URL}/profil/commandes/${data.order_id}`

      // Récupérer le label du statut traduit
      const status = (data.status || 'pending').toLowerCase()
      const statusLabels = t.statusLabels as Record<string, { fr: string; en: string }>
      const statusLabel = statusLabels[status]?.[locale] || status

      return statusUpdateTemplate({
        order_number: displayId,
        status: status,
        statusLabel: statusLabel,
        message: data.message ?? '',
        ctaUrl: ctaUrl,
        locale,
      })
    }

    case 'signup': {
      return signupConfirmationTemplate({
        full_name: data.full_name,
        url: data.url ?? data.confirmation_url,
        locale,
      })
    }

    case 'recovery': {
      return recoveryTemplate({
        url: data.url ?? data.confirmation_url,
        locale,
      })
    }

    case 'email_change': {
      return emailChangeTemplate({
        url: data.url ?? data.confirmation_url,
        locale,
      })
    }

    case 'account_deleted': {
      return accountDeletedTemplate({
        email: data.email,
        locale,
      })
    }

    case 'payment_validated': {
      return paymentValidatedTemplate({
        order_number: data.order_number,
        full_name: data.full_name,
        total_amount: Number(data.total_amount) || 0,
        payment_method: data.payment_method,
        ctaUrl: data.ctaUrl,
        locale,
      })
    }

    case 'welcome': {
      return welcomeTemplate({
        full_name: data.full_name,
        locale,
      })
    }

    default: {
      const t = translations.base
      return genericTemplate({
        title: t.defaultNotificationTitle[locale],
        message: t.defaultNotificationMessage[locale],
        locale,
      })
    }
  }
}
