import type { Meta, StoryObj } from '@storybook/vue3'
import WrapperButton from './WrapperButton.vue'
import { type WrapperButtonProps } from './WrapperButton.types'

const meta: Meta<typeof WrapperButton> = {
  title: 'Wrapper/Bouton',
  component: WrapperButton,
  argTypes: {
    buttonLabel: { control: 'text' },
    type: { control: 'select', options: ['primary', 'reverse', 'secondary', 'danger'] },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    variant: { control: 'select', options: ['filled', 'outlined', 'ghost'] },
    disabled: { control: 'boolean' },
    active: { control: 'boolean' },
    iconName: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    hint: { control: 'text' },
    alertLabel: { control: 'text' },
    iconRight: { control: 'boolean' },
    alertType: {
      control: { type: 'select', options: ['info', 'warning', 'danger', 'success'] },
    },
  },
}

export const BasicButton: StoryObj<WrapperButtonProps> = {
  args: {
    buttonLabel: 'Cliquez ici',
    type: 'primary',
    size: 'medium',
    variant: 'filled',
    disabled: false,
    active: false,
    iconName: undefined,
    iconRight: false,
    label: 'Label du bouton',
    required: false,
    hint: 'Ceci est un bouton',
    alertLabel: '',
    alertType: 'info',
  },
}

export default meta
