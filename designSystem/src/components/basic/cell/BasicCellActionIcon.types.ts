import type { IconName } from '@designSystem/fondation/icons/iconsList'
import type { IconProps } from '../icon'
import type { BasicCellProps } from './BasicCell.types'

export type BasicCellActionIconProps = BasicCellProps &
  Omit<IconProps, 'name' | 'pointer'> & {
    iconName: IconName
    inline?: boolean
    disabled?: boolean
    label?: string
    disabledTooltip?: string
    tooltip?: string
  }
