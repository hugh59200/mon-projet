// ============================================================
// Helper pour calculer et formater les infos de promo d'un item panier
// ============================================================

import type { SimpleCartItem } from '../stores/useCartStore'

export interface CartItemDiscountInfo {
  // Remise produit de base (si is_on_sale)
  productDiscount: number
  // Remise pack (quantité)
  packDiscount: number
  // Remise totale cumulée
  totalDiscount: number
  // Prix unitaire final (après toutes les remises)
  finalUnitPrice: number
  // Prix original (avant toutes les remises)
  originalPrice: number
  // Économie totale pour la quantité
  totalSavings: number
  // Flag si on cumule 2 promos
  hasCumulatedDiscounts: boolean
}

/**
 * Calcule les infos de promo détaillées pour un item du panier
 */
export function getCartItemDiscountInfo(item: SimpleCartItem): CartItemDiscountInfo {
  const originalPrice = Number(item.product_price ?? 0)
  const salePrice = item.is_on_sale
    ? Number(item.product_sale_price ?? originalPrice)
    : originalPrice
  const quantity = Number(item.quantity ?? 1)

  // Remise produit (promo de base)
  const productDiscount = item.is_on_sale && originalPrice > 0
    ? Math.round((1 - salePrice / originalPrice) * 100)
    : 0

  // Remise pack (quantité)
  const packDiscount = Number(item.applied_discount_percent ?? 0)

  // Prix unitaire après remise pack
  const finalUnitPrice = packDiscount > 0
    ? salePrice * (1 - packDiscount / 100)
    : salePrice

  // Remise totale cumulée (par rapport au prix original)
  const totalDiscount = originalPrice > 0
    ? Math.round((1 - finalUnitPrice / originalPrice) * 100)
    : 0

  // Économie totale
  const totalSavings = (originalPrice - finalUnitPrice) * quantity

  return {
    productDiscount,
    packDiscount,
    totalDiscount,
    finalUnitPrice,
    originalPrice,
    totalSavings,
    hasCumulatedDiscounts: productDiscount > 0 && packDiscount > 0,
  }
}

/**
 * Génère un label court pour les badges de promo
 * Ex: "-19%" ou "Promo -10% + Pack -10%"
 */
export function getDiscountLabel(info: CartItemDiscountInfo, detailed: boolean = false): string {
  if (info.totalDiscount <= 0) return ''

  if (detailed && info.hasCumulatedDiscounts) {
    return `Promo -${info.productDiscount}% + Pack -${info.packDiscount}%`
  }

  return `-${info.totalDiscount}%`
}

/**
 * Génère un message pour le toast d'ajout au panier
 */
export function getAddToCartMessage(
  quantity: number,
  discountInfo?: CartItemDiscountInfo | null
): string {
  const qtyText = quantity > 1 ? `Pack de ${quantity}` : ''

  if (!discountInfo || discountInfo.totalDiscount <= 0) {
    return quantity > 1 ? `${qtyText} ajouté au panier` : 'Ajouté au panier'
  }

  if (discountInfo.hasCumulatedDiscounts) {
    return `${qtyText} ajouté • -${discountInfo.totalDiscount}% (Promo + Pack)`
  }

  if (discountInfo.packDiscount > 0) {
    return `${qtyText} ajouté • -${discountInfo.packDiscount}% pack`
  }

  if (discountInfo.productDiscount > 0) {
    return `Ajouté au panier • -${discountInfo.productDiscount}%`
  }

  return quantity > 1 ? `${qtyText} ajouté au panier` : 'Ajouté au panier'
}
