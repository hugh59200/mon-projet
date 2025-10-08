import type { Meta, StoryObj } from '@storybook/vue3'
import BasicSort from './BasicSort.vue'

const meta: Meta<typeof BasicSort> = {
  title: 'Composants/Bouton Sort',
  component: BasicSort,
  argTypes: {
    modelValue: {
      input: 'text',
    },
    name: {
      control: 'text',
    }
  },
}

export default meta

export const Default: StoryObj<typeof BasicSort> = {
  args: {
    modelValue: '',
    name: 'id',
  },
}

export const ModelDifferentFromName: StoryObj<typeof BasicSort> = {
  args: {
    modelValue: 'id asc',
    name: 'formation',
  },
}

export const ModelAndNameMatch: StoryObj<typeof BasicSort> = {
  args: {
    modelValue: 'formation desc',
    name: 'formation',
  },
}