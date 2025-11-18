import { type AvatarProps } from '@designSystem/components/basic/avatar/BasicAvatar.types'
import type { IconName } from '@designSystem/fondation/icons/iconsList'
import type { BadgeProps } from '../breadcrumbs'

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
