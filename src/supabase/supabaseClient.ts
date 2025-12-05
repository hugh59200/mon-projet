import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase/types/supabase'

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

/**
 * Client Supabase sans typage strict
 * À utiliser pour les nouvelles tables/fonctions en attendant la régénération des types
 * Après `npm run gen:types`, migrer vers le client typé `supabase`
 *
 * Note: Réutilise le même client pour éviter l'erreur "Multiple GoTrueClient instances"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseUntyped = supabase as unknown as ReturnType<typeof createClient<any>>
