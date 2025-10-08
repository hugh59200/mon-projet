import type { Meta, StoryObj } from '@storybook/vue3'
import WrapperDropdownMultiple from './WrapperDropdownMultiple.vue'
import { type WrapperDropdownProps } from '../dropdown/WrapperDropdown.types'

const meta: Meta<typeof WrapperDropdownMultiple> = {
  title: 'Wrapper/Menu déroulant multiple',
  component: WrapperDropdownMultiple as any,
  argTypes: {
    items: { control: 'object' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    hint: { control: 'text' },
    alertLabel: { control: 'text' },
    alertType: {
      control: { type: 'select', options: ['info', 'warning', 'danger', 'success'] },
    },
  },
}

const items = [
  { id: 0, label: 'Option 1' },
  { id: 1, label: 'Option 2' },
  { id: 2, label: 'Option 3' },
  { id: 3, label: 'Option 4' },
]

export const ChoixMultiple: StoryObj<WrapperDropdownProps> = {
  args: {
    items: items,
    placeholder: 'Sélectionnez des options',
    label: 'Description du wrapper multiple',
    alertLabel: "message d'avertissement",
    hint: 'Sélection multiple',
    alertType: 'warning',
    required: true,
  },
}

export default meta
