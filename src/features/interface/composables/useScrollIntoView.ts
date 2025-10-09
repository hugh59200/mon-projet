import { useWebComponentNode } from './useWebComponentNode'

export function useScrollIntoView() {
  const baseId = `${Date.now}`

  const makeId = function (index: number) {
    return `${baseId}-${index}`
  }
  const makeVisible = function (index: number) {
    // Prise en charge du fonctionnement en tant que webComponent
    const elem = useWebComponentNode().shadowRoot ?? document
    elem.getElementById(makeId(index))?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  return { makeId, makeVisible }
}
