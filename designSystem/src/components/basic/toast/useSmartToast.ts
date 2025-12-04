import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import type { Products } from '@/supabase/types/supabase.types'
import { CustomToast, CustomToastCompact } from '@designSystem/components'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'

export function useSmartToast() {
  const toast = useToastStore()
  const { isMobile } = useDeviceBreakpoint()

  function showAddToCartToast(p: Products) {
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
