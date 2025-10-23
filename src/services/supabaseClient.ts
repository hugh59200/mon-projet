import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const baseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * 🧠 Proxy Supabase sélectif et “chain-safe”
 * - Gère le sablier UNIQUEMENT sur les appels finaux (pas sur le chainage)
 * - Compatible avec `.eq()`, `.order()`, etc.
 */
export const supabase = new Proxy(baseClient, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    const sablier = useSablierStore()

    // 🎯 On n’intercepte que from(), rpc(), et functions.invoke()
    if (prop === 'from' || prop === 'rpc') {
      return (...args: any[]) => {
        const query = value.apply(target, args)

        // Proxy du QueryBuilder (pour intercepter uniquement les méthodes finales)
        return new Proxy(query, {
          get(qTarget, qProp, qReceiver) {
            const qValue = Reflect.get(qTarget, qProp, qReceiver)

            // Liste des méthodes qui TERMINENT la requête (donc async)
            const finalMethods = [
              'select',
              'insert',
              'update',
              'delete',
              'upsert',
              'single',
              'maybeSingle',
            ]

            // ⚙️ On ne wrappe PAS ces méthodes → elles doivent garder le chainage
            if (finalMethods.includes(qProp.toString())) {
              return (...opArgs: any[]) => {
                // Exécution normale, mais on ajoute .then() pour le sablier
                sablier.debutSablier()
                const result = qValue.apply(qTarget, opArgs)
                if (result instanceof Promise) {
                  return result.finally(() => sablier.finSablier())
                }
                sablier.finSablier()
                return result
              }
            }

            // 👇 Tout le reste (eq, order, range...) reste inchangé
            return qValue
          },
        })
      }
    }

    // 🎯 Gestion spéciale pour supabase.functions.invoke()
    if (prop === 'functions') {
      return new Proxy(value, {
        get(fnTarget, fnProp, fnReceiver) {
          const fn = Reflect.get(fnTarget, fnProp, fnReceiver)
          if (fnProp === 'invoke') {
            return async (...args: any[]) => {
              sablier.debutSablier()
              try {
                return await fn.apply(fnTarget, args)
              } finally {
                sablier.finSablier()
              }
            }
          }
          return fn
        },
      })
    }

    // 🔹 On laisse auth, storage, channel, etc. tranquilles
    return value
  },
})
