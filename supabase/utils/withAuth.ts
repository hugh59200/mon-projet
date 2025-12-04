// supabase/functions/utils/withAuth.ts
import { supabase } from './clients.ts'
import { corsHeaders } from './cors.ts'

export async function withAuth(req: Request, handler: (user: any) => Promise<Response>) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Missing token' }), {
      status: 401,
      headers: corsHeaders,
    })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    })
  }

  // ✅ user validé → exécute la fonction
  try {
    const response = await handler(user)
    return addCors(response)
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

// ✅ Ajoute CORS à la réponse si pas encore présent
function addCors(res: Response) {
  const headers = new Headers(res.headers)
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v))
  return new Response(res.body, { status: res.status, headers })
}
