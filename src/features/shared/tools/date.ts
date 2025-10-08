export type DateRange = {
  start: string | null
  end: string | null
}

export const EMPTY_DATE_RANGE: DateRange = {
 start: null,
 end: null 
} as const

export function isDate(value: string | null | undefined): value is string {
  if (value && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date: Date = new Date(`${value}T00:00:00.000Z`)

    return !isNaN(date.getTime()) && toISODateOnlyString(date) === value
  }

  return false
}

export function addMonth(date: Readonly<Date>, month: number) {
  const newDate = new Date(date)

  newDate.setMonth(date.getMonth() + month)

  // Ajustement nombre de jours quand le mois change
  // Exemple: 31/01/2025 + 1 mois = 28/02/2025
  if (newDate.getDate() != date.getDate()) {
    newDate.setDate(0)
  }

  // Ajustement passage heure ete / hiver
  newDate.setMinutes(newDate.getMinutes() + date.getTimezoneOffset() - newDate.getTimezoneOffset())

  return newDate
}

export function addDays(date: Readonly<Date>, days: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export function addWorkingDays(date: Readonly<Date>, days: number): Date {
  let daysAdd = 0
  const newDate = new Date(date)

  while (daysAdd < days) {
    newDate.setDate(newDate.getDate() + 1)
    const jour = newDate.getDay()
    // Vérifie si c'est un jour ouvré (1 à 5 => Lundi à Vendredi)
    if (jour !== 0 && jour !== 6) {
      daysAdd++
    }
  }

  return newDate
}

export function toISODateOnlyString(date: Date | null): string | null {
  if (date) {
    return date.toISOString().split('T')[0]!
  }

  return null
}

export function checkDateInRange(date: Date, dateRange: DateRange): boolean {
  if (dateRange.start) {
    const start: Date = new Date(dateRange.start)
    if (date.getTime() < start.getTime()) return false
  }

  if (dateRange.end) {
    const end: Date = new Date(dateRange.end)
    if (date.getTime() > end.getTime()) return false
  }

  return true
}

export const maxDate = (dates: Date[]) => new Date(Math.max(...dates.map(Number)))

export function isLastDayOfmonth(date: Date | null): boolean {
  if (date) {
    const month = date.getMonth()
    const debutPlusUnJour: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    return debutPlusUnJour.getMonth() !== month
  } else {
    return false
  }
}

export const dateFormatter = (date: string | null | undefined) => {
  if (!date) return '-'
  const tokens = date.split('-')
  if (tokens.length === 3) {
    return tokens.reverse().join('/')
  }
  return '-'
}

export const dateTimeToReadableDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return new Date(Date.parse(date)).toLocaleDateString('fr-FR')
}

export const readableDatetoDateTime = (date: string | null | undefined) => {
  if (!date) return '-'
  if (date.includes('-')) return new Date(date)
  if (date.includes('/')) return new Date(date.split('/').reverse().join('-'))
  return '-'
}

export function getAge(dateNaissance: Date, dateReference: Date): number {
  const dateAnniversaireReference = new Date(dateReference)
  let years = dateReference.getFullYear() - dateNaissance.getFullYear()
  dateAnniversaireReference.setFullYear(dateReference.getFullYear() - years)

  if (dateNaissance > dateAnniversaireReference) years--

  return years
}

export function getAgeFinAnneeDateReference(dateNaissance: Date, dateReference: Date): number {
  const finAnneeDateReference: Date = getFinAnneeDateReference(dateReference)
  return getAge(dateNaissance, finAnneeDateReference)
}

export function getFinAnneeDateReference(dateReference: Date): Date {
  return new Date(dateReference.getFullYear() + '-12-31')
}

export function getToday(): Date {
  const now = new Date()

  return new Date(
    now.getFullYear() +
      '-' +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      now.getDate().toString().padStart(2, '0'),
  )
}

export function getNbJour(dateDebut: Date, dateFin: Date): number {
  const diff = Math.abs(dateDebut.getTime() - dateFin.getTime())
  return Math.ceil(diff / (1000 * 3600 * 24))
}

export function getNbMonth(dateDebut: Date, dateFin: Date): number {
  const annee1 = dateDebut.getFullYear()
  const mois1 = dateDebut.getMonth() // 0 = janvier, 11 = décembre

  const annee2 = dateFin.getFullYear()
  const mois2 = dateFin.getMonth()

  return (annee2 - annee1) * 12 + (mois2 - mois1)
}

/**
 * Crée une date en UTC à partir des valeurs spécifiées pour l'année, le mois et le jour.
 *
 * @param year - L'année de la date (ex: 2025).
 * @param month - Le mois de la date (0 = janvier, 11 = décembre).
 * @param day - Le jour du mois.
 * @returns Une instance de `Date` en UTC.
 */
export const createUtcDate = (year: number, month: number, day: number): Date => {
  return new Date(Date.UTC(year, month, day))
}
