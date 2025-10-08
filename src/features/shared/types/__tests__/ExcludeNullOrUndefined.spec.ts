import { describe, it, expect } from 'vitest'
import type { ExcludeNullOrUndefined } from '../ExcludeNullOrUndefined.js'

describe('ExcludeNullOrUndefined', () => {
  it('retire null ou undefined du type', () => {
    // Verifie la compilation
    type UneChaineNullOrUndefined = string | null | undefined

    const uneValeur: ExcludeNullOrUndefined<UneChaineNullOrUndefined> = 'Tada'
    // Ne compile pas
    // const uneAutreValeur: ExcludeNullOrUndefined<UneChaineNullOrUndefined> = null

    expect(uneValeur).toEqual('Tada')
  })
})
