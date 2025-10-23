import { useSablierStore } from './useSablierStore'

export function useManualSablier() {
  const sablier = useSablierStore()

  async function withSablier<T>(callback: () => Promise<T> | T): Promise<T> {
    sablier.debutSablier()
    try {
      return await callback()
    } finally {
      sablier.finSablier()
    }
  }

  return { withSablier }
}
