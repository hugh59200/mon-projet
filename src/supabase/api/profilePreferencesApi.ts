import { supabase } from '../supabaseClient'

export async function getUiPreferences(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('ui_preferences')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.ui_preferences as string | null
}

export async function updateUiPreferences(userId: string, prefs: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ ui_preferences: prefs })
    .eq('id', userId)

  if (error) throw new Error(error.message)
}
