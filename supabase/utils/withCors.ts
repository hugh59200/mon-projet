import { corsHeaders, handleCors } from './cors.ts'

export async function withCors(
  req: Request,
  handler: (req: Request) => Promise<Response>,
): Promise<Response> {
  const preflight = handleCors(req)
  if (preflight) return preflight

  try {
    const response = await handler(req)

    const finalResponse = new Response(response.body, {
      ...response,
      headers: new Headers(response.headers),
    })

    Object.entries(corsHeaders).forEach(([k, v]) => finalResponse.headers.set(k, v))

    return finalResponse
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}
