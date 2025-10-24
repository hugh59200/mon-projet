import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🔗 Client Supabase de base
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
 * - Compatible Vue 3 + Pinia
 */
export const supabase = new Proxy(baseClient, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    const sablier = useSablierStore()

    // 🎯 Interception des requêtes principales : from(), rpc()
    if (prop === 'from' || prop === 'rpc') {
      return (...args: any[]) => {
        const query = value.apply(target, args)

        // Proxy interne pour intercepter uniquement les méthodes finales (async)
        return new Proxy(query, {
          get(qTarget, qProp, qReceiver) {
            const qValue = Reflect.get(qTarget, qProp, qReceiver)

            // Méthodes terminales (exécutent réellement la requête)
            const finalMethods = [
              'select',
              'insert',
              'update',
              'delete',
              'upsert',
              'single',
              'maybeSingle',
            ]

            // 🔚 Gestion du sablier uniquement sur les appels finaux
            if (finalMethods.includes(qProp.toString())) {
              return (...opArgs: any[]) => {
                sablier.debutSablier()
                const start = performance.now()
                const result = qValue.apply(qTarget, opArgs)

                if (result instanceof Promise) {
                  return result.finally(() => {
                    const duration = performance.now() - start
                    // ⏱️ Ne montre le sablier que si la requête dure > 300ms
                    if (duration > 300) sablier.finSablier()
                    else sablier.finSablier()
                  })
                }

                sablier.finSablier()
                return result
              }
            }

            // 🧩 Toutes les autres méthodes (eq, order, range...) restent inchangées
            return qValue
          },
        })
      }
    }

    // ⚙️ Gestion spéciale pour supabase.functions.invoke()
    if (prop === 'functions') {
      return new Proxy(value, {
        get(fnTarget, fnProp, fnReceiver) {
          const fn = Reflect.get(fnTarget, fnProp, fnReceiver)
          if (fnProp === 'invoke') {
            return async (...args: any[]) => {
              sablier.debutSablier()
              const start = performance.now()
              try {
                const result = await fn.apply(fnTarget, args)
                return result
              } finally {
                const duration = performance.now() - start
                if (duration > 300) sablier.finSablier()
                else sablier.finSablier()
              }
            }
          }
          return fn
        },
      })
    }

    // 🔹 Ne touche pas à auth, storage, channel, etc.
    return value
  },
})
