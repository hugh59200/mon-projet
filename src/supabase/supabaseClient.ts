import { createClient } from '@supabase/supabase-js'
import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
import type { Database } from '@/supabase/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Client Supabase de base (sans sablier)
const baseClient = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * Client Supabase SILENCIEUX (sans sablier global)
 * À utiliser dans les composants qui gèrent leur propre loading :
 * - Pages avec skeletons (TrackOrderView, PaymentSuccessView)
 * - Pages avec WrapperLoader (Catalogue, Admin, Orders)
 * - Composants avec loading sur bouton (CheckoutView)
 */
export const supabaseSilent = baseClient

/**
 * Client Supabase avec SABLIER GLOBAL
 * À utiliser uniquement pour :
 * - Actions d'authentification (login, register, logout)
 * - Actions critiques sans feedback visuel local
 */
export const supabase = new Proxy(baseClient, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    const sablier = useSablierStore()

    // Interception des requêtes principales : from(), rpc()
    if (prop === 'from' || prop === 'rpc') {
      return (...args: [string, ...unknown[]]) => {
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

            // Gestion du sablier uniquement sur les appels finaux
            if (finalMethods.includes(qProp.toString())) {
              return (...opArgs: unknown[]) => {
                sablier.debutSablier()
                const start = performance.now()
                const result = qValue.apply(qTarget, opArgs)

                if (result instanceof Promise) {
                  return result.finally(() => {
                    const duration = performance.now() - start
                    if (duration > 300) sablier.finSablier()
                    else sablier.finSablier()
                  })
                }

                sablier.finSablier()
                return result
              }
            }

            // Toutes les autres méthodes (eq, order, range...) restent inchangées
            return qValue
          },
        })
      }
    }

    // Gestion spéciale pour supabase.functions.invoke()
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

    // GESTION AUTHENTIFICATION
    // On garde le sablier sur signIn, signUp, etc. car ce sont des actions critiques
    if (prop === 'auth') {
      return new Proxy(value, {
        get(authTarget, authProp, authReceiver) {
          const authFn = Reflect.get(authTarget, authProp, authReceiver)
          const trackedAuthMethods = [
            'signInWithPassword',
            'signUp',
            'signOut',
            'resetPasswordForEmail',
            'signInWithOAuth',
            'verifyOtp',
          ]

          if (typeof authFn === 'function' && trackedAuthMethods.includes(authProp.toString())) {
            return async (...args: any[]) => {
              sablier.debutSablier()
              const start = performance.now()
              try {
                return await authFn.apply(authTarget, args)
              } finally {
                const duration = performance.now() - start
                if (duration > 300) sablier.finSablier()
                else sablier.finSablier()
              }
            }
          }
          return authFn
        },
      })
    }

    // Ne touche pas à storage, channel, etc.
    return value
  },
})
