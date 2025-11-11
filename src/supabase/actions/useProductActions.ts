import { useDialog } from '@/features/interface/dialog'
import type { Products, ProductsInsert, ProductsUpdate } from '@/supabase/types/supabase.types'
import { sanitizeHTML } from '@/utils/sanitize'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { createProductInDB, deleteProductById, updateProductInDB } from '../api/productsApi'

export function useProductActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  /** ✅ Suppression avec confirmation professionnelle */
  async function deleteProduct(product: Products) {
    const safeName = sanitizeHTML(product.name)

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer ce produit ?',
      message: [
        `
        <p style="margin:0 0 12px;">
          Voulez-vous vraiment supprimer ce produit ?
        </p>

        <p style="margin:0 0 12px;">
          <strong>Produit :</strong> ${safeName}
        </p>

        <p style="margin:0;">
          <strong>Confirmez-vous ?</strong>
        </p>
      `,
      ],
      isHtml: true,
      closable: false,
    })

    if (result !== 'Yes') return

    try {
      await deleteProductById(product.id as string)
      toast.show('Produit supprimé ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  /** ✅ Mise à jour */
  async function updateProduct(id: string, data: ProductsUpdate) {
    try {
      await updateProductInDB(id, data)
      toast.show('Produit mis à jour ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur mise à jour : ${err.message}`, 'danger')
    }
  }

  /** ✅ Création */
  async function createProduct(data: ProductsInsert) {
    try {
      await createProductInDB(data)
      toast.show('Produit créé ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur création : ${err.message}`, 'danger')
    }
  }

  return { deleteProduct, updateProduct, createProduct }
}
