import { isNullOrUndefined, isNullUndefinedOrEmptyString } from '@/features/shared/tools/object'

export interface IInputDuree {
  heure: number | string | null
  minute: number | null
}

export function inputDureeToString(value?: IInputDuree | null): string | null {
  if (isNullOrUndefined(value)) return null
  if (typeof value === 'object') {
    if (typeof value?.heure === 'number' && typeof value?.minute === 'number') {
      const strMinutes = `00${value?.minute}`.slice(-2)
      return `${value?.heure}h${strMinutes}`
    } else {
      return value?.heure as string
    }
  }
  return null
}

export function stringToInputDuree(value?: string | null): IInputDuree {
  const captures = /^(\d{1,4})[h:](\d{2})$/i.exec(value ?? '')
  if (captures) {
    const heures = parseInt(captures[1])
    const minutes = parseInt(captures[2])

    if (minutes < 60) {
      return {
        heure: heures,
        minute: minutes,
      }
    }
  }
  return {
    heure: isNullUndefinedOrEmptyString(value) ? null : value!,
    minute: null,
  }
}

