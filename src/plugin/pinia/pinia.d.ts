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
          paths?: Array<keyof S> // ✅ important : keyof S pour typer les champs du store
          beforeRestore?: (ctx: { store: Store }) => void
          afterRestore?: (ctx: { store: Store }) => void
        }
  }
}
