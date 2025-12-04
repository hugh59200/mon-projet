import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

Deno.serve(
  createHandler(async (_req, { user_id }: { user_id?: string }) => {
    if (!user_id) throw new Error('Missing user_id')

    const { data, error } = await supabase.auth.admin.getUserById(user_id)
    if (error || !data?.user) throw new Error('User not found')

    const email = data.user.email

    await supabase.from('profiles').delete().eq('id', user_id)
    const { error: deleteErr } = await supabase.auth.admin.deleteUser(user_id)
    if (deleteErr) throw new Error(`Auth delete failed: ${deleteErr.message}`)

    if (email) {
      await sendEmail({
        to: email,
        subject: 'Compte supprimé ✅',
        html: renderEmailTemplate('account_deleted', { email }),
        type: 'account_deleted',
      })
    }

    console.log(`✅ [ADMIN] Deleted user: ${user_id}`)
    return { deleted_user: user_id }
  }),
)
