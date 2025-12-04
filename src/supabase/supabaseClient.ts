import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase/types/supabase'

// DEBUG: À supprimer après le test
console.log("🔍 DEBUG SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("🔍 DEBUG SUPABASE KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Présente (Cachée) ?" : "Manquante");


// Votre code habituel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/** @deprecated Alias conservé pour compatibilité - utiliser `supabase` directement */
export const supabaseSilent = supabase
