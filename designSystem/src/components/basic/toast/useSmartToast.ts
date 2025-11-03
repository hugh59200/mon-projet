import type { Product } from '@/features/catalogue/types/product'
import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import { CustomToast, CustomToastCompact } from '@designSystem/components'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

export function useSmartToast() {
  const toast = useToastStore()
  const { isMobile } = useDeviceBreakpoint()

  function showAddToCartToast(p: Product) {
    toast.show({
      component: isMobile.value ? CustomToastCompact : CustomToast,
      props: {
        title: p.name,
        message: 'Ajouté au panier',
        image: p.image,
        price: p.price,
      },
      duration: isMobile.value ? 2500 : 4000,
    })
  }

  return { showAddToCartToast }
}
