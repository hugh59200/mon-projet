import { describe, it, expect } from 'vitest'
import type { DeepPartial } from '../DeepPartial.js'

type Item = {
  propA: string
  propB: string
  propItem: Item
  propArray: Array<Item>
}

describe('DeepPartial', () => {
  it('redéfinie un type avec ses membres optionnels', () => {
    const item: DeepPartial<Item> = {
      propA: 'ok',
    }
    expect(item).toHaveProperty('propA')
    expect(item).not.toHaveProperty('propB')
  })

  it('redéfinie un type avec ses membres imbriqués optionnels', () => {
    const item: DeepPartial<Item> = {
      propA: 'ok',
      propItem: {
        propB: 'ok',
        propItem: {
          propA: 'Ok',
        },
      },
    }
    expect(item).toHaveProperty('propA')
    expect(item).not.toHaveProperty('propB')
    expect(item.propItem).toHaveProperty('propB')
    expect(item.propItem?.propItem).toHaveProperty('propA')
  })

  it('redéfinie un type avec ses membres imbriqués dans des tableaux optionnels', () => {
    const item: DeepPartial<Item> = {
      propA: 'ok',
      propArray: [{ propA: 'ok' }, { propB: 'ok' }, {}, { propArray: [{ propA: 'ok' }] }],
    }
    expect(item).toHaveProperty('propA')
    expect(item).not.toHaveProperty('propB')
    expect(item).toHaveProperty('propArray')
    expect(item.propArray?.at(0)).toHaveProperty('propA')
    expect(item.propArray?.at(0)).not.toHaveProperty('propB')
    expect(item.propArray?.at(1)).toHaveProperty('propB')
    expect(item.propArray?.at(1)).not.toHaveProperty('propA')
    // En ainsi de suite
  })
})
