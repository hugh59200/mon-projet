import type { Meta, StoryObj } from '@storybook/vue3'
import BasicTag from './BasicTag.vue'
import { TagLabel, type TagSize, tagSizes } from './BasicTag.types'

const meta: Meta<typeof BasicTag> = {
  title: 'Composants/Etiquette',
  component: BasicTag,
  argTypes: {
    label: {
      control: 'select',
      options: Object.values(TagLabel),
    },
    size: {
      control: 'select',
      options: tagSizes as TagSize[],
    },
  },
}

export const NonTraite: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.NonTraite,
    size: 'medium',
  },
}

export const ATraite: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.ATraite,
    size: 'small',
  },
}

export const Traite: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.Traite,
    size: 'medium',
  },
}

export const NonConforme: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.NonConforme,
    size: 'medium',
  },
}

export const EnTraitement: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.EnTraitement,
    size: 'small',
  },
}

export const Conforme: StoryObj<typeof BasicTag> = {
  args: {
    label: TagLabel.Conforme,
    size: 'small',
  },
}

export default meta
