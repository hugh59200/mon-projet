import type { Profiles, Role } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { deleteUserById, updateUserRole } from '../api/userApi'

export function useUserActions(fetchData?: () => void) {
  const toast = useToastStore()

  async function deleteUser(user: Profiles) {
    if (!confirm(`Supprimer ${user.email} ?`)) return
    try {
      await deleteUserById(user.id)
      toast.show('Utilisateur supprimé ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${(err as Error).message}`, 'danger')
    }
  }

  async function changeUserRole(user: Profiles, role: Role) {
    try {
      await updateUserRole(user.id, role)
      toast.show('Rôle mis à jour ✅', 'success')
      fetchData?.()
    } catch (err: any) {
      toast.show(`Erreur rôle : ${(err as Error).message}`, 'danger')
    }
  }

  return {
    deleteUser,
    changeUserRole,
  }
}
