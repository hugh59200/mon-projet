import { describe, it, expect } from 'vitest'
import type { NestedKeyOf } from '../NestedKeyOf.js'

describe('NestedKeyOf', () => {
  it('gere les objets imbriqués', () => {
    type Foo = {
      a: string
    }
    type Bar = {
      b: number
      foo: Foo
    }
    const key: NestedKeyOf<Bar> = 'foo.a'
    expect(key).toEqual('foo.a')
  })

  it('autorise les tableaux', () => {
    type Foo = {
      a: string
    }
    type Bar = {
      b: number
      foo: Array<Foo>
    }

    const key: NestedKeyOf<Bar> = 'foo.0.a'
    expect(key).toEqual('foo.0.a')
  })
})

