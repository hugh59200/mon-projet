import type { Meta, StoryObj } from '@storybook/vue3'
import BasicToggleSwitch from './BasicToggleSwitch.vue'
import { toggleSizes, type ToggleItem, type ToggleSize } from './BasicToggleSwitch.types'
import type { ConcreteComponent } from 'vue'

const toggleOptions: ToggleItem[] = [
  { id: 'Secteur privé', label: 'Secteur privé' },
  { id: 'Secteur public', label: 'Secteur public' },
]

const meta: Meta<typeof BasicToggleSwitch> = {
  title: 'Composants/Bouton bascule',
  component: BasicToggleSwitch as unknown as ConcreteComponent,
  argTypes: {
    size: {
      control: 'radio',
      options: toggleSizes as ToggleSize[],
    },
    items: {
      control: 'object',
    },
  },
  args: {
    items: toggleOptions,
  },
}

export default meta

export const Petit: StoryObj<typeof BasicToggleSwitch> = {
  args: {
    size: 'small',
  },
}

export const Moyen: StoryObj<typeof BasicToggleSwitch> = {
  args: {
    size: 'medium',
  },
}

export const Grand: StoryObj<typeof BasicToggleSwitch> = {
  args: {
    size: 'large',
  },
}
