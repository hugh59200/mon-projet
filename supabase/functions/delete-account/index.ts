import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase } from '../../utils/clients.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('OK', { headers: cors })

  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return new Response('Missing token', { status: 401, headers: cors })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) return new Response('Unauthorized', { status: 401, headers: cors })

    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.admin.deleteUser(user.id)

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: cors })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: cors,
    })
  }
})
