import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface AdminDeleteBody {
  user_id: string
}

Deno.serve(
  createHandler(async (_req, body: AdminDeleteBody) => {
    const { user_id } = body
    if (!user_id) throw new Error('Missing user_id')

    const { data: targetUser, error: getUserErr } = await supabase.auth.admin.getUserById(user_id)
    if (getUserErr || !targetUser?.user) throw new Error('User not found')

    const email = targetUser.user.email

    await supabase.from('profiles').delete().eq('id', user_id)

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id)
    if (deleteError) throw new Error(`Auth delete failed: ${deleteError.message}`)

    if (email) {
      const html = renderEmailTemplate('account_deleted', { email })

      await sendEmail({
        to: email,
        subject: 'Votre compte a été supprimé ✅',
        html,
        type: 'account_deleted',
      })
    }

    return { success: true, deleted_user: user_id }
  }),
)
