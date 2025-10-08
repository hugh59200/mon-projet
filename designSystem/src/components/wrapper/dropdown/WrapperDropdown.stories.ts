import type { Meta, StoryObj } from '@storybook/vue3'
import WrapperDropdown from './WrapperDropdown.vue'
import { type WrapperDropdownProps } from '../dropdown/WrapperDropdown.types'

const meta: Meta<typeof WrapperDropdown> = {
  title: 'Wrapper/Menu déroulant',
  component: WrapperDropdown as any,
  argTypes: {
    items: { control: 'object' },
    alertType: {
      control: { type: 'select', options: ['info', 'warning', 'danger', 'success'] },
    },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    hint: { control: 'text' },
    alertLabel: { control: 'text' },
  },
}

const items = [
  { id: 0, label: 'Option 1' },
  { id: 1, label: 'Option 2' },
  { id: 2, label: 'Option 3' },
  { id: 3, label: 'Option 4' },
]

export const ChoixSimple: StoryObj<WrapperDropdownProps> = {
  args: {
    items: items,
    placeholder: 'Sélectionnez une option',
    label: 'Description du wrapper',
    alertLabel: "message d'avertissement",
    hint: '30 caractères maximum',
    alertType: 'warning',
    required: true,
  },
}

export default meta
