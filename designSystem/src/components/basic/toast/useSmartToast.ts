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
    // Générer le message selon les promos
    let message = 'Ajouté au panier'
    let discountBadge: string | undefined

    if (packInfo && packInfo.qty > 1) {
      const qtyText = `Pack de ${packInfo.qty}`

      if (packInfo.hasCumulatedDiscounts) {
        message = `${qtyText} ajouté`
        discountBadge = `-${packInfo.totalDiscountPercent}% (Promo + Pack)`
      } else if (packInfo.packDiscount > 0) {
        message = `${qtyText} ajouté`
        discountBadge = `-${packInfo.packDiscount}% pack`
      } else {
        message = `${qtyText} ajouté au panier`
      }
    }

    toast.show({
      component: isMobile.value ? CustomToastCompact : CustomToast,
      props: {
        title: p.name,
        message,
        image: p.image,
        price: p.price,
        discountBadge,
        savings: packInfo?.savings,
      },
      duration: isMobile.value ? 2500 : 4000,
    })
  }

  return { showAddToCartToast }
}
