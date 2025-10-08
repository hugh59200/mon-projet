import type { Meta, StoryObj } from '@storybook/vue3'
import BasicDropdown from './BasicDropdown.vue'
import { dropdownSizes, type DropdownProps, type DropdownSize } from './BasicDropdown.types'

const meta: Meta<typeof BasicDropdown> = {
  title: 'Composants/Menu déroulant',
  component: BasicDropdown as any,
  argTypes: {
    items: { control: 'object' },
    placeholder: { control: 'text' },
    size: {
      control: 'select',
      options: dropdownSizes as DropdownSize[],
    },
  },
}

const items = [
  { id: 0, label: 'Option 1' },
  { id: 1, label: 'Option 2' },
  { id: 2, label: 'Option 3' },
  { id: 3, label: 'Option 4' },
]

export const ChoixSimple: StoryObj<DropdownProps> = {
  args: {
    items: items,
  },
}

export default meta

