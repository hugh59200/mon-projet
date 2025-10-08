import type { Meta, StoryObj } from '@storybook/vue3'
import WrapperInput from './WrapperInput.vue'
import { type WrapperInputProps } from './WrapperInput.types'

const meta: Meta<typeof WrapperInput> = {
  title: 'Wrapper/Champ de saisie',
  component: WrapperInput,
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
    maxlength: { control: 'number' },
    iconState: { control: 'select', options: ['iconLeft', 'iconRight'] },
    iconName: { control: 'text' },
  },
}

export const BasicInput: StoryObj<WrapperInputProps> = {
  args: {
    placeholder: 'Entrez du texte',
    label: 'Label du champ de saisie',
    alertLabel: '',
    alertType: 'info',
    required: false,
    hint: 'Indication de saisie',
    size: 'medium',
    validationState: 'success',
    maxlength: 100,
    iconState: 'iconLeft',
    iconName: undefined,
  },
}

export default meta
