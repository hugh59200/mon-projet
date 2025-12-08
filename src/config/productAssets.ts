/**
 * Configuration des assets produits stockés sur Supabase Storage
 * Bucket: products
 */

const SUPABASE_STORAGE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public'

/**
 * URL de l'image par défaut pour les produits sans image
 */
export const DEFAULT_PRODUCT_IMAGE = `${SUPABASE_STORAGE_URL}/products/default-product-image.webp`

/**
 * Helper pour construire l'URL d'une image produit
 */
export function getProductImageUrl(imageName: string): string {
  if (!imageName) return DEFAULT_PRODUCT_IMAGE
  if (imageName.startsWith('http')) return imageName
  return `${SUPABASE_STORAGE_URL}/products/${imageName}`
}
