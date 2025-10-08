import type { Meta, StoryObj } from '@storybook/vue3'
import BasicRadio from './BasicRadio.vue'

const meta: Meta<typeof BasicRadio> = {
  title: 'Composants/Bouton Radio',
  component: BasicRadio,
  argTypes: {
    modelValue: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
}

export default meta

export const ParDéfaut: StoryObj<typeof BasicRadio> = {
  args: {
    modelValue: false,
    label: 'Option 1',
  },
}

export const Coché: StoryObj<typeof BasicRadio> = {
  args: {
    modelValue: true,
    label: 'Option 2',
  },
}

export const Désactivé: StoryObj<typeof BasicRadio> = {
  args: {
    modelValue: false,
    disabled: true,
    label: 'Option 3',
  },
}
