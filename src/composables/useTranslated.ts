import { useI18n } from 'vue-i18n'
import { computed, type MaybeRef, toValue } from 'vue'
import type { Products, News, NewsTopics } from '@/supabase/types/supabase.types'

// ==========================================
// 🌍 Types pour les champs i18n JSONB
// ==========================================

type I18nField = Record<string, string> | null

interface ProductWithI18n extends Products {
  name_i18n?: I18nField
  description_i18n?: I18nField
  category_i18n?: I18nField
}

interface NewsWithI18n extends News {
  title_i18n?: I18nField
  excerpt_i18n?: I18nField
  content_i18n?: I18nField
}

interface NewsTopicWithI18n extends NewsTopics {
  label_i18n?: I18nField
  description_i18n?: I18nField
}

// ==========================================
// 🔧 Helper générique
// ==========================================

/**
 * Récupère la valeur traduite d'un champ JSONB
 * @param i18nField - Le champ JSONB contenant les traductions {"en": "...", "de": "..."}
 * @param fallback - La valeur par défaut (français)
 * @param locale - La locale actuelle
 */
function getTranslatedValue(
  i18nField: I18nField | undefined,
  fallback: string | null,
  locale: string,
): string {
  // Si locale FR, retourner directement le fallback
  if (locale === 'fr') {
    return fallback ?? ''
  }

  // Sinon, chercher dans le JSONB
  if (i18nField && typeof i18nField === 'object' && locale in i18nField) {
    return i18nField[locale] ?? fallback ?? ''
  }

  // Fallback sur la valeur FR
  return fallback ?? ''
}

// ==========================================
// 🛒 Composable pour Products
// ==========================================

export function useTranslatedProduct(product: MaybeRef<ProductWithI18n | null | undefined>) {
  const { locale } = useI18n()

  const name = computed(() => {
    const p = toValue(product)
    if (!p) return ''
    return getTranslatedValue(p.name_i18n, p.name, locale.value)
  })

  const description = computed(() => {
    const p = toValue(product)
    if (!p) return ''
    return getTranslatedValue(p.description_i18n, p.description, locale.value)
  })

  const category = computed(() => {
    const p = toValue(product)
    if (!p) return ''
    return getTranslatedValue(p.category_i18n, p.category, locale.value)
  })

  return {
    name,
    description,
    category,
  }
}

// ==========================================
// 📰 Composable pour News
// ==========================================

export function useTranslatedNews(news: MaybeRef<NewsWithI18n | null | undefined>) {
  const { locale } = useI18n()

  const title = computed(() => {
    const n = toValue(news)
    if (!n) return ''
    return getTranslatedValue(n.title_i18n, n.title, locale.value)
  })

  const excerpt = computed(() => {
    const n = toValue(news)
    if (!n) return ''
    return getTranslatedValue(n.excerpt_i18n, n.excerpt, locale.value)
  })

  const content = computed(() => {
    const n = toValue(news)
    if (!n) return ''
    return getTranslatedValue(n.content_i18n, n.content, locale.value)
  })

  return {
    title,
    excerpt,
    content,
  }
}

// ==========================================
// 🏷️ Composable pour NewsTopics
// ==========================================

export function useTranslatedTopic(topic: MaybeRef<NewsTopicWithI18n | null | undefined>) {
  const { locale } = useI18n()

  const label = computed(() => {
    const t = toValue(topic)
    if (!t) return ''
    return getTranslatedValue(t.label_i18n, t.label, locale.value)
  })

  const description = computed(() => {
    const t = toValue(topic)
    if (!t) return ''
    return getTranslatedValue(t.description_i18n, t.description, locale.value)
  })

  return {
    label,
    description,
  }
}

// ==========================================
// 🔄 Helper pour listes de produits
// ==========================================

export interface TranslatedProduct {
  original: ProductWithI18n
  name: string
  description: string
  category: string
}

/**
 * Traduit une liste de produits (non réactif, pour les listes)
 */
export function translateProducts(
  products: ProductWithI18n[],
  locale: string,
): TranslatedProduct[] {
  return products.map(p => ({
    original: p,
    name: getTranslatedValue(p.name_i18n, p.name, locale),
    description: getTranslatedValue(p.description_i18n, p.description, locale),
    category: getTranslatedValue(p.category_i18n, p.category, locale),
  }))
}

/**
 * Composable réactif pour une liste de produits
 */
export function useTranslatedProducts(products: MaybeRef<ProductWithI18n[]>) {
  const { locale } = useI18n()

  const translatedProducts = computed(() => {
    const list = toValue(products)
    return translateProducts(list, locale.value)
  })

  return {
    products: translatedProducts,
  }
}

// ==========================================
// 🎯 Export helper direct
// ==========================================

/**
 * Helper simple pour obtenir une traduction d'un champ
 * Usage: getTranslated(product.name_i18n, product.name, 'en')
 */
export { getTranslatedValue as getTranslated }
