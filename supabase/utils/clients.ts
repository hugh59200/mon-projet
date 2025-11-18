import { Resend } from 'https://esm.sh/resend@3.2.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

// -------------------------
export const ENV = Deno.env.get('ENV') || 'development'

// -------------------------
export const APP_BASE_URL =
  ENV === 'development' ? 'https://localhost:5278' : 'https://fast-peptides.com'

// -------------------------
export const PAYMENT_SUCCESS_URL_BASE = `${APP_BASE_URL}/paiement/success`
export const PAYMENT_CANCEL_URL = `${APP_BASE_URL}/paiement/cancel`

// -------------------------
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!

// -------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
export const resend = new Resend(RESEND_API_KEY)
export const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
