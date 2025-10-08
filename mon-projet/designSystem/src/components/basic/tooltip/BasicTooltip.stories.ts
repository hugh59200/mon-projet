import type { Meta, StoryObj } from '@storybook/vue3'
import BasicTooltip from './BasicTooltip.vue'
import { TooltipPosition } from './BasicTooltip.types'

const meta: Meta<typeof BasicTooltip> = {
  title: 'Composants/Tooltip',
  component: BasicTooltip,
  argTypes: {
    label: { control: 'text' },
    position: {
      control: 'select',
      options: TooltipPosition,
    },
  },
}

export const LeftLargeurAuto: StoryObj<typeof BasicTooltip> = {
  args: {
    label: 'Details',
    position: 'left',
  },
}

export const BottomLargeurFixe: StoryObj<typeof BasicTooltip> = {
  args: {
    label: 'Details',
    position: 'bottom',
  },
}

export default meta
