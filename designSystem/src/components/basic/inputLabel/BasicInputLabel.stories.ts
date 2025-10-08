import type { Meta, StoryObj } from '@storybook/vue3'
import BasicInputLabel from './BasicInputLabel.vue'

const meta: Meta<typeof BasicInputLabel> = {
  title: "Composants/label d'aide",
  component: BasicInputLabel,
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    help: { control: 'boolean' },
  },
}

export const RequiredWithHelp: StoryObj<typeof BasicInputLabel> = {
  args: {
    label: "Libellé de l'entrée",
    required: true,
    help: 'aide',
  },
}

export const OptionalWithHelp: StoryObj<typeof BasicInputLabel> = {
  args: {
    label: "Libellé de l'entrée optionnelle",
    required: false,
    help: 'aide',
  },
}

export const SimpleLabel: StoryObj<typeof BasicInputLabel> = {
  args: {
    label: "Libellé de l'entrée simple",
    required: false,
  },
}

export default meta
