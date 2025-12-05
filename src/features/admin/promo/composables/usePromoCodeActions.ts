import { useDialog } from '@/features/interface/dialog'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import {
  deletePromoCode,
  updatePromoCode,
  createPromoCode,
  togglePromoCodeActive,
  type PromoCode,
} from '@/api/supabase/promo'

export function usePromoCodeActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  /** Suppression avec confirmation */
  async function deleteCode(code: PromoCode) {
    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer ce code promo ?',
      message: [
        `
        <p style="margin:0 0 12px;">
          Voulez-vous vraiment supprimer ce code promo ?
        </p>

        <p style="margin:0 0 12px;">
          <strong>Code :</strong> ${code.code}
        </p>

        <p style="margin:0 0 12px; color: var(--warning-600);">
          Cette action est irréversible et supprimera également l'historique d'utilisation.
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
      await deletePromoCode(code.id)
      toast.show('Code promo supprimé', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  /** Toggle actif/inactif */
  async function toggleActive(code: PromoCode) {
    try {
      await togglePromoCodeActive(code.id, !code.active)
      toast.show(
        code.active ? 'Code promo désactivé' : 'Code promo activé',
        'success',
      )
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur : ${err.message}`, 'danger')
    }
  }

  /** Mise à jour */
  async function updateCode(
    id: string,
    data: Partial<Omit<PromoCode, 'id' | 'current_uses' | 'created_at'>>,
  ) {
    try {
      await updatePromoCode(id, data)
      toast.show('Code promo mis à jour', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur mise à jour : ${err.message}`, 'danger')
    }
  }

  /** Création */
  async function createCode(
    data: Omit<PromoCode, 'id' | 'current_uses' | 'created_at' | 'updated_at'>,
  ) {
    try {
      await createPromoCode(data)
      toast.show('Code promo créé', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur création : ${err.message}`, 'danger')
    }
  }

  return { deleteCode, updateCode, createCode, toggleActive }
}
