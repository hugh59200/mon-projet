// ✅ src/supabase/actions/useProfilePreferencesActions.ts
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { getUiPreferences, updateUiPreferences } from '../api/profilePreferencesApi'

export function useProfilePreferencesActions() {
  const toast = useToastStore()

  async function load(userId: string) {
    try {
      return await getUiPreferences(userId)
    } catch (err: any) {
      toast.show(`Erreur préférences : ${err.message}`, 'danger')
      return null
    }
  }

  async function save(userId: string, prefs: string) {
    try {
      await updateUiPreferences(userId, prefs)
    } catch (err: any) {
      toast.show(`Erreur sauvegarde : ${err.message}`, 'danger')
    }
  }

  return { load, save }
}
