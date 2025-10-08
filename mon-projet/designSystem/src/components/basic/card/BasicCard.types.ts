import { type AvatarProps } from '@designSystem/components/basic/avatar/BasicAvatar.types'
import type { BadgeProps } from '../badge'
import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type SubtitleProps = {
  text: string
  icon?: IconName | undefined
}

export type CardProps = {
  avatar?: AvatarProps
  title?: string
  subtitles?: SubtitleProps[]
  deletable?: boolean
  badge?: BadgeProps
  onCardClosed?: () => void
  onTagClosed?: () => void
  onCardClick?: () => void
  selectionnable?: boolean
  showFavoris?: boolean
  isFavoris?: boolean
}
