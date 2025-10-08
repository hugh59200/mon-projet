export function useAutoId(prefix = 'uid') {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const random = array[0].toString(36)
  return `${prefix}-${random}`
}
