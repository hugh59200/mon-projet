export type ParseIntResult = number | null | undefined
export function parseIntWithDefault(value: string | null | undefined, defaultValue?: ParseIntResult): ParseIntResult {
  if (value === null || value === undefined) return defaultValue
  const result = parseInt(value)
  if (isNaN(result)) {
    return defaultValue
  } else {
    return result
  }
}

export function isNumber(value?: string | number | null): value is number {
  return value != null && value !== '' && !isNaN(Number(value.toString()))
}

export function formatNumber(
  value?: any,
  options?: { decimal?: number; separateur?: boolean; pourcentage?: boolean } | number,
) {
  if (typeof value !== 'number') {
    return value
  }

  if (typeof options === 'number') {
    options = {
      decimal: options,
    }
  }

  let str = (value * (options?.pourcentage ? 100 : 1)).toFixed(options?.decimal ?? 0).replace(/\./g, ',')
  if (options?.separateur) {
    str = str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
  return str
}

// export function decimalHandler(value: number) {
//   return (Math.round(value * 100) / 100).toFixed(2)
// }

