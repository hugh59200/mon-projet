import { corsHeaders, handleCors } from './cors.ts'

type HandlerFn<T> = (req: Request, body: T) => Promise<unknown> | unknown

/**
 * Standard JSON API handler
 */
export function createHandler<T = unknown>(handler: HandlerFn<T>) {
  return async (req: Request): Promise<Response> => {
    const cors = handleCors(req)
    if (cors) return cors

    try {
      let body: unknown = undefined

      if (req.method !== 'GET') {
        try {
          body = await req.json()
        } catch {
          body = undefined
        }
      }

      // 🟦 Telling TS: "trust me, runtime is fine"
      const typedBody = body as T

      const result = await handler(req, typedBody)

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

/**
 * Webhook handler (Stripe / PayPal / Coinbase)
 * Returns rawBody for signature verification
 */
export function createWebhookHandler(
  handler: (rawBody: string, req: Request) => Promise<unknown> | unknown,
) {
  return async (req: Request): Promise<Response> => {
    const cors = handleCors(req)
    if (cors) return cors

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders,
      })
    }

    try {
      // RAW body obligatoire pour Stripe
      const buf = await req.arrayBuffer()
      const rawBody = new TextDecoder().decode(buf)

      const result = await handler(rawBody, req)

      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
        headers: corsHeaders,
      })
    } catch (err) {
      console.error('❌ Webhook error:', err)

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
