import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    // ✅ Auth obligatoire
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return new Response(JSON.stringify({ error: 'No auth token' }), {
        status: 401,
      })
    }

    // ✅ Supabase client (avec RLS bypass car service role)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // ✅ Récupération de l’utilisateur authentifié
    const { data: user, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user?.user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
      })
    }

    const userId = user.user.id

    // ✅ On supprime l’avatar s’il existe
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .maybeSingle()

    if (profile?.avatar_url) {
      await supabase.storage.from('avatars').remove([profile.avatar_url])
    }

    // ✅ Supprimer l’utilisateur (cascade fait le reste)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('❌ delete-account error:', err)
    return new Response(JSON.stringify({ error: `${err}` }), {
      status: 500,
    })
  }
})
