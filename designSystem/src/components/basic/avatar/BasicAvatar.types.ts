import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type AvatarSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
export type AvatarType = 'icon' | 'media' | 'name' | 'date'

export const Mounth = [
  'Janvier',
  'Fevrier',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Decembre',
] as const
export type Mounth = (typeof Mounth)[number]

export type AvatarProps = {
  name?: string
  iconName?: IconName | undefined
  imageUrl?: string
  dayAndMounth?: DayAndMounth
  avatarSize?: AvatarSize
  type: AvatarType
}

export type DayAndMounth = {
  day?: string
  mounth?: Mounth
}

export const avatarSizes: AvatarSize[] = ['extra-small', 'small', 'medium', 'large', 'extra-large']
export const avatarTypes: AvatarType[] = ['icon', 'media', 'name']
