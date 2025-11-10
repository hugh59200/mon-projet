import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'No token provided' }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token)

    if (userErr || !user) {
      return new Response(JSON.stringify({ success: false, error: 'User not authenticated' }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    await supabase.from('profiles').delete().eq('id', user.id)

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
