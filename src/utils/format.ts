export function formatDate(date?: string | null, locale = 'fr-FR'): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long', // ✅ novembre
    year: 'numeric',
  })
}

export function formatCurrency(amount?: number | null, currency = 'EUR'): string {
  if (amount == null) return '-'
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency,
  })
}
