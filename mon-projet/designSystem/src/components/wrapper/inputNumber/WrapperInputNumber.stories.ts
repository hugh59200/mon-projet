import type { Meta, StoryObj } from '@storybook/vue3'
import WrapperInputNumber from './WrapperInputNumber.vue'
import { type WrapperInputNumberProps } from './WrapperInputNumber.types'

const meta: Meta<typeof WrapperInputNumber> = {
  title: 'Wrapper/Champ de saisie numérique',
  component: WrapperInputNumber,
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    hint: { control: 'text' },
    alertLabel: { control: 'text' },
    alertType: {
      control: { type: 'select', options: ['info', 'warning', 'danger', 'success'] },
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    validationState: { control: 'select', options: ['success', 'error'] },
    decimal: { control: 'number' },
    maxlength: { control: 'number' },
    iconState: { control: 'select', options: ['iconLeft', 'iconRight'] },
    iconName: { control: 'text' },
  },
}

export const BasicInputNumber: StoryObj<WrapperInputNumberProps> = {
  args: {
    placeholder: 'Entrez un nombre',
    label: 'Label du champ de saisie numérique',
    alertLabel: '',
    alertType: 'info',
    required: false,
    hint: 'Indication de saisie numérique',
    size: 'medium',
    decimal: 2,
    maxlength: 100,
    iconState: 'iconLeft',
    iconName: undefined,
  },
}

export default meta
