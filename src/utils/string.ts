export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, maxLength = 50): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
}
