import type { Meta, StoryObj } from '@storybook/vue3'
import BasicDropdownMultiple from './BasicDropdownMultiple.vue'
import { dropdownSizes, type DropdownProps, type DropdownSize } from '../dropdown/BasicDropdown.types'

const meta: Meta<typeof BasicDropdownMultiple> = {
  title: 'Composants/Menu déroulant',
  component: BasicDropdownMultiple as any,
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

export const ChoixMultiple: StoryObj<DropdownProps> = {
  args: {
    items: items,
  },
}

export default meta
