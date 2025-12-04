import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import {
  claimGuestOrders,
  getLastOrders,
  getProfile,
  updatePasswordApi,
  updateProfileInfo,
  uploadAvatar,
} from '@/api/supabase/profiles'

type ActionResponse = Promise<boolean>

export function useProfileActions() {
  const toast = useToastStore()

  async function loadProfile(id: string) {
    try {
      const profile = await getProfile(id)

      // Récupération automatique des commandes invités
      if (profile && profile.email) {
        await claimGuestOrders(profile.email, id)
      }

      return profile
    } catch (err: any) {
      toast.show(`Erreur profil : ${err.message}`, 'danger')
      return null
    }
  }

  async function updateProfile(id: string, payload: any): ActionResponse {
    try {
      await updateProfileInfo(id, payload)
      return true
    } catch (err: any) {
      toast.show(`Erreur mise à jour : ${err.message}`, 'danger')
      return false
    }
  }

  async function changeAvatar(id: string, file: File) {
    try {
      const publicUrl = await uploadAvatar(id, file)
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

  async function updatePassword(newPassword: string): ActionResponse {
    try {
      await updatePasswordApi(newPassword)
      return true
    } catch (err: any) {
      toast.show(err.message, 'danger')
      return false
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
