// supabase/utils/emailClient.ts
import { Resend } from "https://esm.sh/resend@3.2.0"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!

export const emailClient = new Resend(RESEND_API_KEY)
