import { useDialog } from '@/features/interface/dialog/useDialog'
import { useProfileActions } from '@/supabase/actions/useProfileActions'

const { showDialog } = useDialog()
const { deleteAccount } = useProfileActions()

export async function onDeleteAccountClick() {
  const result = await showDialog({
    type: 'YesNo',
    title: 'Supprimer mon compte',
    message: [
      'Cette action est définitive.',
      'Toutes vos données seront supprimées.',
      'Confirmez-vous ?',
    ],
    closable: false,
  })

  if (result === 'Yes') {
    await deleteAccount()
  }
}
