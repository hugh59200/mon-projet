// /src/features/interface/sablier/configSablier.ts
import { useSablierController } from '@/features/interface/sablier/useSablierController'

export type Fetch = typeof fetch

export function configSablier(nextFetch: Fetch): Fetch {
  const controller = useSablierController()

  return async function (input: RequestInfo | URL, init?: RequestInit) {
    const withSablier = init?.sablier !== false // activé par défaut
    if (!withSablier) return nextFetch(input, init)

    controller.debutSablier()
    try {
      const response = await nextFetch(input, init)
      return response
    } finally {
      controller.finSablier()
    }
  }
}
