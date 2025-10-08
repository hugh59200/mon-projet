import type { Meta, StoryObj } from '@storybook/vue3'
import BasicPopup from './BasicPopup.vue'
import { popupTypes } from './BasicPopup.types'

const loremIpsum = {
  titleText: 'Lorem ipsum',
  firstParagraph:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  secondParagraph:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}

const meta: Meta<typeof BasicPopup> = {
  title: 'Composants/Alerte',
  component: BasicPopup,
  argTypes: {
    type: { control: { type: 'select' }, options: popupTypes },
  },
}

export const SimpleSansIcone: StoryObj<typeof BasicPopup> = {
  args: {
    hasCloseAction: false,
    type: 'primary',
  },
}

export const SimpleSansIconeAvecActionFermer: StoryObj<typeof BasicPopup> = {
  args: {
    hasCloseAction: true,
    type: 'secondary',
  },
}

export const SimpleAvecIcone: StoryObj<typeof BasicPopup> = {
  args: {
    hasCloseAction: false,
    type: 'success',
  },
}

export const SimpleAvecIconeActionFermer: StoryObj<typeof BasicPopup> = {
  args: {
    hasCloseAction: true,
    type: 'danger',
  },
}

export const CompletSansIcone: StoryObj<typeof BasicPopup> = {
  args: {
    ...loremIpsum,
    hasCloseAction: false,
    type: 'info',
  },
}

export const CompletSansIconeAvecActionFermer: StoryObj<typeof BasicPopup> = {
  args: {
    ...loremIpsum,
    hasCloseAction: true,
    type: 'warning',
  },
}

export const CompletAvecIcone: StoryObj<typeof BasicPopup> = {
  args: {
    ...loremIpsum,
    hasCloseAction: false,
    type: 'primary',
  },
}

export const CompletAvecIconeEtActionFermer: StoryObj<typeof BasicPopup> = {
  args: {
    ...loremIpsum,
    hasCloseAction: true,
    type: 'secondary',
  },
}

export default meta
