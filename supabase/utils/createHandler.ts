import { corsHeaders, handleCors } from './cors.ts'

type HandlerFn<T> = (req: Request, body: T) => Promise<any> | any

export function createHandler<T = unknown>(handler: HandlerFn<T>) {
  return async (req: Request): Promise<Response> => {
    // ✅ OPTIONS → direct CORS response
    const cors = handleCors(req)
    if (cors) return cors

    try {
      // ✅ Essayons de parser le JSON proprement
      let body: T | undefined
      if (req.method !== 'GET') {
        try {
          body = (await req.json()) as T
        } catch {
          body = undefined as any
        }
      }

      // ✅ Exécute la fonction principale
      const result = await handler(req, body as T)

      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
        headers: corsHeaders,
      })
    } catch (err) {
      console.error('❌ Function error:', err)

      return new Response(
        JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : String(err),
        }),
        { status: 400, headers: corsHeaders },
      )
    }
  }
}
