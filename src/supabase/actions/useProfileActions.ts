import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import {
  getLastOrders,
  getProfile,
  updatePasswordApi,
  updateProfileInfo,
  uploadAvatar,
} from '../api/profilesApi'

export function useProfileActions() {
  const toast = useToastStore()
  const auth = useAuthStore()

  async function loadProfile(id: string) {
    try {
      return await getProfile(id)
    } catch (err: any) {
      toast.show(`Erreur profil : ${err.message}`, 'danger')
      return null
    }
  }

  async function updateProfile(id: string, payload: any) {
    try {
      await updateProfileInfo(id, payload)
      toast.show('Profil mis à jour ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur mise à jour : ${err.message}`, 'danger')
    }
  }

  async function changeAvatar(id: string, file: File) {
    try {
      const publicUrl = await uploadAvatar(id, file)
      toast.show('Avatar mis à jour 🎨', 'success')
      return publicUrl
    } catch (err: any) {
      toast.show(`Erreur avatar : ${err.message}`, 'danger')
      return null
    }
  }

  async function loadLastOrdersAction(id: string) {
    try {
      return await getLastOrders(id)
    } catch (err: any) {
      toast.show(`Erreur commandes : ${err.message}`, 'danger')
      return []
    }
  }

  async function updatePassword(newPassword: string) {
    try {
      await updatePasswordApi(newPassword) // ✅ Manquait l'import
      toast.show('Mot de passe mis à jour ✅', 'success')
    } catch (err: any) {
      toast.show(err.message, 'danger')
    }
  }

  return {
    loadProfile,
    updateProfile,
    changeAvatar,
    loadLastOrdersAction,
    updatePassword,
  }
}
