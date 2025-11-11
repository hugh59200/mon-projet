import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

Deno.serve(
  createHandler(async (req) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('Missing token')

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) throw new Error('Unauthorized')

    const email = user.email

    await supabase.from('profiles').delete().eq('id', user.id)

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) throw new Error(`Auth delete failed: ${deleteError.message}`)

    if (email) {
      const html = renderEmailTemplate('account_deleted', { email })

      await sendEmail({
        to: email,
        subject: 'Votre compte a bien été supprimé ✅',
        html,
        type: 'account_deleted',
      })
    }

    return { success: true, deleted_user: user.id }
  }),
)
