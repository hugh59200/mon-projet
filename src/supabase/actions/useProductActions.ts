// src/supabase/services/useProductActions.ts
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import type { Products, ProductsInsert, ProductsUpdate } from '@/supabase/types/supabase.types'
import { deleteProductById, updateProductInDB, createProductInDB } from '../api/productsApi'

export function useProductActions(fetchData?: () => void) {
  const toast = useToastStore()

  async function deleteProduct(product: Products) {
    if (!confirm(`Supprimer ${product.name} ?`)) return
    try {
      await deleteProductById(product.id as string)
      toast.show('Produit supprimé ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  async function updateProduct(id: string, data: ProductsUpdate) {
    try {
      await updateProductInDB(id, data)
      toast.show('Produit mis à jour ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur mise à jour : ${err.message}`, 'danger')
    }
  }

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
