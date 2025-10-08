import type { Meta, StoryObj } from '@storybook/vue3-vite'
import WrapperToggleSwitch from './WrapperToggleSwitch.vue'
import { type WrapperToggleSwitchProps } from './WrapperToggleSwitch.types'
import type { ConcreteComponent } from 'vue'
import { BasicToggleSwitch } from '@designSystem/components'

const meta: Meta<typeof WrapperToggleSwitch> = {
  title: 'Wrapper/Bouton bascule',
  component: BasicToggleSwitch as unknown as ConcreteComponent,
  argTypes: {
    items: { control: 'object' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    label: { control: 'text' },
    required: { control: 'boolean' },
    hint: { control: 'text' },
    alertLabel: { control: 'text' },
    alertType: {
      control: { type: 'select', options: ['info', 'warning', 'danger', 'success'] },
    },
  },
}

const options = [
  { label: 'On', id: 1 },
  { label: 'Off', id: 0 },
]

export const ToggleSwitchExample: StoryObj<WrapperToggleSwitchProps> = {
  args: {
    items: options,
    size: 'medium',
    label: 'bouton bascule',
    required: true,
    hint: 'Allumer ou éteindre',
    alertLabel: '',
    alertType: 'info',
  },
}

export default meta
