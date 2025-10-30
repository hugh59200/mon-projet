// src/types/pinia.d.ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Active la persistance automatique du store
     * via pinia-plugin-persistedstate
     */
    persist?:
      | boolean
      | {
          key?: string
          storage?: Storage
          paths?: string[]
        }
  }
}
