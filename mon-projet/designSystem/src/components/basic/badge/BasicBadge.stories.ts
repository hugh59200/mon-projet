import type { Meta, StoryObj } from '@storybook/vue3'
import BasicBadge from './BasicBadge.vue'
import { badgeTypes, type BadgeType } from './BasicBadge.types'

const meta: Meta<typeof BasicBadge> = {
  title: 'Composants/Badge',
  component: BasicBadge,
  argTypes: {
    label: { control: 'text' },
    type: {
      control: 'select',
      options: badgeTypes as BadgeType[],
    },
    size: { control: 'select', options: ['medium', 'small'] },
  },
}

export const Defaut: Story = {
  args: {
    label: 'Default',
    type: 'default',
    deletable: false,
    size: 'medium',
  },
}

export const Fermable: Story = {
  args: {
    label: 'Active',
    type: 'pending',
    deletable: true,
    size: 'small',
  },
}

export default meta
type Story = StoryObj<typeof meta>
