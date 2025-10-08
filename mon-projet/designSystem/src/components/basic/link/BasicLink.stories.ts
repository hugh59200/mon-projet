import type { Meta, StoryObj } from '@storybook/vue3'
import BasicLink from './BasicLink.vue'
import {
  linkSizes,
  linkStates,
  linkTypes,
  type LinkSize,
  type StandaloneLinkProps,
  type LinkState,
  type LinkType,
} from './BasicLink.types'

const meta: Meta<typeof BasicLink> = {
  title: 'Composants/Lien',
  component: BasicLink,
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: linkSizes as LinkSize[],
      },
    },
    type: {
      control: {
        type: 'radio',
        options: linkTypes as LinkType[],
      },
    },
    state: {
      control: {
        type: 'radio',
        options: linkStates as LinkState[],
      },
    },
  },
}

export const SansIcône: StoryObj<StandaloneLinkProps> = {
  args: {
    label: 'Lien primaire',
    type: 'primary',
    size: 'medium',
    state: 'text-only',
  },
}

export const IcôneDevant: StoryObj<StandaloneLinkProps> = {
  args: {
    label: 'Lien avec icône devant',
    type: 'primary',
    size: 'medium',
    state: 'icon-left',
  },
}

export const IcôneAprès: StoryObj<StandaloneLinkProps> = {
  args: {
    label: 'Lien avec icône après',
    type: 'primary',
    size: 'medium',
    state: 'icon-right',
  },
}

export default meta
