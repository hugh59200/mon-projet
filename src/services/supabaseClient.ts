// /src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // ✅ garde la session dans localStorage
    autoRefreshToken: true, // ✅ rafraîchit automatiquement le token JWT
    detectSessionInUrl: true, // ✅ nécessaire pour OAuth / Magic Link
  },
})
