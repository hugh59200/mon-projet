import type { Meta, StoryObj } from '@storybook/vue3'
import BasicCheckbox from './BasicCheckbox.vue'

const meta: Meta<typeof BasicCheckbox> = {
  title: 'Composants/Checkbox',
  component: BasicCheckbox,
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

export const Déterminée: StoryObj<typeof BasicCheckbox> = {
  args: {
    modelValue: false,
    label: 'Déterminée',
  },
}

export const Indéterminée: StoryObj<typeof BasicCheckbox> = {
  args: {
    modelValue: null,
    label: 'Indéterminée',
  },
}

export const DésactivéeNonCochée: StoryObj<typeof BasicCheckbox> = {
  args: {
    modelValue: false,
    disabled: true,
    label: 'Désactivée Non Cochée',
  },
}

export const DésactivéeCochée: StoryObj<typeof BasicCheckbox> = {
  args: {
    modelValue: true,
    disabled: true,
    label: 'Désactivée Cochée',
  },
}

export const DésactivéeIndéterminée: StoryObj<typeof BasicCheckbox> = {
  args: {
    modelValue: null,
    disabled: true,
    label: 'Désactivée Indéterminée',
  },
}
