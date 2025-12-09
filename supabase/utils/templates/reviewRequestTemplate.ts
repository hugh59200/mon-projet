// supabase/utils/templates/reviewRequestTemplate.ts
// Template email pour les demandes d'avis produit (J+10 après expédition)

import { baseEmailTemplate } from './baseEmailTemplate.ts'
import { type Locale, translations } from '../i18n.ts'
import { EMAIL_ASSETS } from '../emailAssets.ts'

export function reviewRequestTemplate({
  order_number,
  full_name,
  product_name,
  product_image,
  ctaUrl,
  locale = 'fr',
}: {
  order_number: string
  full_name?: string
  product_name: string
  product_image?: string | null
  product_slug?: string
  ctaUrl: string
  locale?: Locale
}) {
  const t = translations.reviewRequest

  // Image du produit ou fallback
  const productImageUrl = product_image || EMAIL_ASSETS['welcome']

  const bodyHTML = `
    <p>${t.greeting[locale](full_name || '')}</p>

    <p>${t.intro[locale](order_number)}</p>

    <!-- Produit à évaluer -->
    <div style="margin: 24px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center;">
      ${productImageUrl ? `
        <div style="margin-bottom: 16px;">
          <img
            src="${productImageUrl}"
            width="100"
            height="100"
            alt="${product_name}"
            style="border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;"
          />
        </div>
      ` : ''}
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #0f172a;">
        ${product_name}
      </p>
    </div>

    <p style="text-align: center; color: #64748b; font-size: 14px; margin: 20px 0;">
      ${t.encouragement[locale]}
    </p>

    <!-- Pourquoi donner son avis -->
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #065f46;">
        ${t.whyReviewTitle[locale]}
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #047857;">
        <li style="margin-bottom: 6px;">${t.whyReviewPoint1[locale]}</li>
        <li style="margin-bottom: 6px;">${t.whyReviewPoint2[locale]}</li>
        <li style="margin-bottom: 0;">${t.whyReviewPoint3[locale]}</li>
      </ul>
    </div>

    <!-- Note sur la simplicité -->
    <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #92400e;">
        ${t.simpleNote[locale]}
      </p>
    </div>
  `

  return baseEmailTemplate({
    title: t.title[locale],
    bodyHTML,
    ctaLabel: t.ctaLabel[locale],
    ctaUrl,
    heroImage: EMAIL_ASSETS['welcome'],
    locale,
  })
}
