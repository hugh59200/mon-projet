import { createClient } from 'jsr:@supabase/supabase-js@2'

// URL de l'application - configurable via secret ou valeur par défaut prod
export const APP_BASE_URL = Deno.env.get('APP_BASE_URL') || 'https://fast-peptides.com'

export const PAYMENT_SUCCESS_URL_BASE = `${APP_BASE_URL}/paiement/success` // J'ai ajusté cette ligne pour utiliser APP_BASE_URL si besoin de tester les redirections de paiement via tunnel
export const PAYMENT_CANCEL_URL = `${APP_BASE_URL}/paiement/cancel`

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export const FUNCTION_URL =
  Deno.env.get('FUNCTION_URL') ?? 'https://dwomsbawthlktapmtmqu.supabase.co/functions/v1'
