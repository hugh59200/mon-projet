import { useSablierStore } from './useSablierStore'

export interface IControleurSablier {
  debutSablier(): void
  finSablier(): void
}

export function useSablierController(): IControleurSablier {
  const store = useSablierStore()

  function debutSablier() {
    store.debutSablier()
  }

  function finSablier() {
    store.finSablier()
  }

  return {
    debutSablier,
    finSablier,
  }
}
