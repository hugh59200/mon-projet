import type { Profiles, Role } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { deleteUserById, deleteUserSelf, updateUserRole } from '../api/userApi'

export function useUserActions(fetchData?: () => void) {
  const toast = useToastStore()

  async function deleteUser(user: Profiles) {
    if (!confirm(`Supprimer ${user.email} ?`)) return

    try {
      await deleteUserById(user.id)
      toast.show('Utilisateur supprimé ✅', 'success')

      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

  async function deleteOwnAccount() {
    if (!confirm('Supprimer votre compte ? Cette action est définitive.')) return

    try {
      await deleteUserSelf()
      toast.show('Compte supprimé ✅', 'success')

      // ✅ déconnexion & redirection
      window.location.href = '/'
    } catch (err: any) {
      toast.show(`Erreur suppression : ${err.message}`, 'danger')
    }
  }

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
