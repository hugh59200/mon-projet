// supabase/utils/templates/statusUpdateTemplate.ts
// Template premium pour les mises à jour de statut de commande

import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'

type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'processing' | 'shipped' | 'completed' | 'canceled' | 'refunded' | 'failed'

interface StatusConfig {
  iconSvg: string
  bgColor: string
  borderColor: string
  textColor: string
  badgeColor: string
  badgeBg: string
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>`,
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    textColor: '#92400e',
    badgeColor: '#ffffff',
    badgeBg: '#f59e0b',
  },
  confirmed: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#065f46',
    badgeColor: '#ffffff',
    badgeBg: '#10b981',
  },
  paid: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#10b981" stroke-width="2"/><path d="M2 10h20" stroke="#10b981" stroke-width="2"/><circle cx="16" cy="15" r="2" fill="#10b981"/></svg>`,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#065f46',
    badgeColor: '#ffffff',
    badgeBg: '#10b981',
  },
  processing: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/></svg>`,
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1e40af',
    badgeColor: '#ffffff',
    badgeBg: '#3b82f6',
  },
  shipped: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    textColor: '#155e75',
    badgeColor: '#ffffff',
    badgeBg: '#0891b2',
  },
  completed: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#059669" stroke-width="2" stroke-linecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#065f46',
    badgeColor: '#ffffff',
    badgeBg: '#059669',
  },
  canceled: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>`,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#991b1b',
    badgeColor: '#ffffff',
    badgeBg: '#ef4444',
  },
  refunded: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10h10a5 5 0 010 10H9M3 10l4-4M3 10l4 4" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#5b21b6',
    badgeColor: '#ffffff',
    badgeBg: '#8b5cf6',
  },
  failed: {
    iconSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/></svg>`,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#991b1b',
    badgeColor: '#ffffff',
    badgeBg: '#dc2626',
  },
}

export function statusUpdateTemplate({
  order_number,
  status,
  statusLabel,
  message,
  ctaUrl,
  locale = 'fr',
}: {
  order_number: string
  status: string
  statusLabel: string
  message: string
  ctaUrl: string
  locale?: Locale
}) {
  const t = translations.statusUpdate
  const config = STATUS_CONFIG[status.toLowerCase() as OrderStatus] || STATUS_CONFIG.pending

  const bodyHTML = `
    <!-- Message principal dans une box colorée -->
    <div style="background:${config.bgColor};border:1px solid ${config.borderColor};border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="margin:0;font-size:15px;color:${config.textColor};line-height:1.7;">
        ${message}
      </p>
    </div>

    <!-- Détails de la commande -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#f8fafc;padding:16px 20px;border-bottom:1px solid #e2e8f0;">
          <span style="font-weight:600;color:#334155;font-size:15px;">${t.orderInfo[locale]}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;color:#64748b;font-size:14px;">${t.orderNumber[locale]}</td>
              <td style="padding:8px 0;text-align:right;font-weight:600;color:#334155;font-size:14px;">#${order_number}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#64748b;font-size:14px;">${t.currentStatus[locale]}</td>
              <td style="padding:8px 0;text-align:right;">
                <span style="display:inline-block;background:${config.badgeBg};color:${config.badgeColor};font-size:12px;font-weight:600;padding:4px 12px;border-radius:12px;">
                  ${statusLabel}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Note de suivi -->
    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:8px;">
      <p style="margin:0;font-size:13px;color:#64748b;text-align:center;">
        ${t.trackingNote[locale]}
      </p>
    </div>
  `

  return baseEmailTemplate({
    title: t.title[locale](order_number),
    bodyHTML,
    ctaLabel: t.ctaViewDetails[locale],
    ctaUrl,
    locale,
  })
}
