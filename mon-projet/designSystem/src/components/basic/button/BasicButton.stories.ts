import type { Meta, StoryObj } from '@storybook/vue3'
import BasicButton from './BasicButton.vue'
import {
  type ButtonType,
  type ButtonSize,
  type ButtonVariant,
  buttonSizes,
  buttonTypes,
  buttonVariants,
} from './BasicButton.types'

const meta: Meta<typeof BasicButton> = {
  title: 'Composants/Bouton',
  component: BasicButton,
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: buttonSizes as ButtonSize[],
      },
    },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    type: {
      control: {
        type: 'select',
        options: buttonTypes as ButtonType[],
      },
    },
    variant: {
      control: {
        type: 'radio',
        options: buttonVariants as ButtonVariant[],
      },
    },
    iconRight: { control: 'boolean' },
  },
}

export const IconeGauche: StoryObj = {
  args: {
    type: 'primary',
    iconName: 'arrow-up',
    label: 'Monter',
    size: 'medium',
    variant: 'filled',
    active: false,
    disabled: false,
    iconRight: false,
  },
}

export const IconeDroite: StoryObj = {
  args: {
    type: 'primary',
    iconName: 'arrow-down',
    label: 'Descendre',
    size: 'medium',
    variant: 'filled',
    active: false,
    disabled: false,
    iconRight: true,
  },
}

export const SansIcone: StoryObj = {
  args: {
    type: 'primary',
    label: 'Sans icône',
    size: 'medium',
    variant: 'filled',
    iconRight: false,
  },
}

export const SansLabel: StoryObj = {
  args: {
    type: 'primary',
    iconName: 'arrow-up',
    size: 'medium',
    variant: 'filled',
    iconRight: false,
  },
}

export default meta
