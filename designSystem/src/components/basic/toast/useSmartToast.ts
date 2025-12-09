import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import type { Products } from '@/supabase/types/supabase.types'
import { CustomToast, CustomToastCompact } from '@designSystem/components'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

// Type pour les infos de pack (correspond à packInfo dans ProductDetails)
export interface PackDiscountInfo {
  qty: number
  productDiscount: number
  packDiscount: number
  totalDiscountPercent: number
  savings: number
  hasCumulatedDiscounts: boolean
}

export function useSmartToast() {
  const toast = useToastStore()
  const { isMobile } = useDeviceBreakpoint()

  function showAddToCartToast(p: Products, packInfo?: PackDiscountInfo | null) {
    // Calculer la promo produit si pas dans packInfo
    const productDiscount = packInfo?.productDiscount ?? (
      p.is_on_sale && p.sale_price && p.price
        ? Math.round((1 - p.sale_price / p.price) * 100)
        : 0
    )

    // Quantité ajoutée
    const qty = packInfo?.qty ?? 1

    // Générer le message selon les promos
    let message: string
    let discountBadge: string | undefined

    if (qty > 1) {
      // Pack de plusieurs produits
      const qtyText = `× ${qty}`

      if (packInfo?.hasCumulatedDiscounts) {
        message = `${qtyText} ajouté au panier`
        discountBadge = `-${packInfo.totalDiscountPercent}% (Promo + Pack)`
      } else if (packInfo && packInfo.packDiscount > 0) {
        message = `${qtyText} ajouté au panier`
        discountBadge = `-${packInfo.packDiscount}% pack`
      } else if (productDiscount > 0) {
        message = `${qtyText} ajouté au panier`
        discountBadge = `-${productDiscount}% promo`
      } else {
        message = `${qtyText} ajouté au panier`
      }
    } else {
      // Produit unique
      if (productDiscount > 0) {
        message = 'Ajouté au panier'
        discountBadge = `-${productDiscount}% promo`
      } else {
        message = 'Ajouté au panier'
      }
    }

    toast.show({
      component: isMobile.value ? CustomToastCompact : CustomToast,
      props: {
        title: p.name,
        message,
        image: p.image,
        price: p.is_on_sale && p.sale_price ? p.sale_price : p.price,
        discountBadge,
        savings: packInfo?.savings,
      },
      duration: isMobile.value ? 2500 : 4000,
    })
  }

  return { showAddToCartToast }
}
