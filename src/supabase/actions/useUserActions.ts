import { useDialog } from '@/features/interface/dialog'
import type { Profiles, Role } from '@/supabase/types/supabase.types'
import { sanitizeHTML } from '@/utils/sanitize'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { deleteUserById, deleteUserSelf, updateUserRole } from '../api/userApi'

export function useUserActions(fetchData?: () => void) {
  const toast = useToastStore()
  const { showDialog } = useDialog()

  /** ✅ Suppression par un admin */
  async function deleteUser(user: Profiles) {
    const safeEmail = sanitizeHTML(user.email)

    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer cet utilisateur ?',
      message: [
        `
        <p style="margin:0 0 12px;">
          Voulez-vous vraiment supprimer ce compte ?
        </p>

        <p style="margin:0 0 12px;">
          <strong>Email :</strong> ${safeEmail}
        </p>

        <p style="margin:0 0 12px;">
          Toutes les données liées à ce compte seront définitivement perdues.
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
      await deleteUserById(user.id)
      toast.show('Utilisateur supprimé ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  /** ✅ Suppression du propre compte (utilisateur) */
  async function deleteOwnAccount() {
    const result = await showDialog({
      type: 'YesNo',
      title: 'Supprimer mon compte ?',
      message: [
        `
        <p style="margin:0 0 12px;">
          Cette action va supprimer votre compte et toutes vos données associées.
        </p>

        <p style="margin:0 0 12px;">
          Cette suppression est définitive.
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
      await deleteUserSelf()
      toast.show('Compte supprimé ✅', 'success')
      window.location.href = '/'
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  /** ✅ Changement de rôle admin */
  async function changeUserRole(user: Profiles, role: Role) {
    try {
      await updateUserRole(user.id, role)
      toast.show('Rôle mis à jour ✅', 'success')

      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur rôle : ${err.message}`, 'danger')
    }
  }

  return {
    deleteUser,
    deleteOwnAccount,
    changeUserRole,
  }
}
