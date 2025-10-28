import { registerPopupAuto } from '@/features/application/popup-auto/PopupAuto'
import { supabase } from '@/supabase/supabaseClient'
import { useAfficheCGUStore } from './useAfficheCGUStore'
import { useVersionCGUStore } from './useVersionCGUStore'

export function registerPopupAutoCGU() {
  registerPopupAuto({
    key: 'CGU',
    canPopup: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return false

      const { data: profile } = await supabase
        .from('profiles')
        .select('cgu_accepted')
        .eq('id', user.id)
        .single()

      return profile?.cgu_accepted === false
    },

    showPopup: async () => {
      const dialogCGU = useAfficheCGUStore()
      await dialogCGU.showDialog({ validationObligatoire: true })

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({
            cgu_accepted: true,
            cgu_accepted_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      }

      const versionStore = useVersionCGUStore()
      versionStore.setCguValidées()
    },
  })
}
