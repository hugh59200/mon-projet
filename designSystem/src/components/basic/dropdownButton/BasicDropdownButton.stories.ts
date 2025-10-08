import type { Meta, StoryObj } from '@storybook/vue3'
import BasicDropdown from './BasicDropdownButton.vue'
import { type DropdownButtonProps } from './BasicDropdownButton.types'
import { BasicDropdownButton } from '@designSystem/components'

const meta: Meta<typeof BasicDropdown> = {
  title: 'Composants/Menu déroulant bouton',
  component: BasicDropdownButton as any,
  argTypes: {
    items: { control: 'object' },
  },
}

const items = [
  { id: 0, label: 'Option 1' },
  { id: 1, label: 'Option 2' },
  { id: 2, label: 'Option 3' },
  { id: 3, label: 'Option 4' },
]

export const ChoixSimple: StoryObj<DropdownButtonProps> = {
  args: {
    items: items,
  },
}

export default meta
