import { describe, it } from 'vitest'
import { type ConstArrayKeysToUnionType } from '../ConstArrayKeysToUnionType'
import { noop } from '../../tools/noop.js'

describe('ConstArrayKeysToUnionType', () => {
  it("s'utilise", () => {
    const unSymbol = Symbol('un symbol')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unTableauDeKey = ['nom', 'prenom', 456, unSymbol] as const

    type UnionTypeDeKeys = ConstArrayKeysToUnionType<typeof unTableauDeKey>

    const test1: UnionTypeDeKeys = 'nom'
    const test2: UnionTypeDeKeys = 456
    const test3: UnionTypeDeKeys = unSymbol
    noop(test1, test2, test3)

    // Ce code échoue à la compilation
    // @ts-expect-error 'boom' n'existe pas dans le tableau
    const test4: UnionTypeDeKeys = 'boom'
    console.log(test4)
  })
})

