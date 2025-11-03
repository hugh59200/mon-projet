import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import CustomToast from '@designSystem/components/basic/toast/CustomToast.vue'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { CustomToastCompact } from '@designSystem/index'

export function useProductToasts() {
  const toast = useToastStore()
  const { isMobile } = useDeviceBreakpoint()

  function showAddToCartToast(product: { name: string; image?: string; price: number }) {
    toast.show({
      component: isMobile.value ? CustomToastCompact : CustomToast,
      props: {
        title: product.name,
        message: 'Ajouté au panier',
        image: product.image,
        price: product.price,
      },
      duration: isMobile.value ? 2500 : 4000,
    })
  }

  function showLoadErrorToast() {
    toast.show('Erreur lors du chargement du catalogue', 'danger')
  }

  return {
    showAddToCartToast,
    showLoadErrorToast,
  }
}
