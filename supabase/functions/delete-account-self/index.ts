import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

export default Deno.serve(
  createHandler(async (req) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('Missing token')

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) throw new Error('Unauthorized')

    const user = data.user

    // Supprimer profile
    await supabase.from('profiles').delete().eq('id', user.id)

    // Supprimer compte auth
    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
    if (delErr) throw new Error(`Auth delete failed: ${delErr.message}`)

    // Email confirmation
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Compte supprimé ✅',
        html: renderEmailTemplate('account_deleted', { email: user.email }),
        type: 'account_deleted',
      })
    }

    return { deleted_user: user.id }
  }),
)
