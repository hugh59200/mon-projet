import type { Meta, StoryObj } from '@storybook/vue3'
import BasicInput from './BasicInput.vue'
import { inputSizes, inputValidationStates, type InputSize, type ValidationState } from './BasicInput.types'

const meta: Meta<typeof BasicInput> = {
  title: 'Composants/Champs de saisie',
  component: BasicInput,
  argTypes: {
    modelValue: { control: 'text' },
    size: {
      control: 'select',
      options: inputSizes as InputSize[],
    },
    deletable: { control: 'boolean' },
    validationState: {
      control: 'select',
      options: inputValidationStates as ValidationState[],
    },
    placeholder: { control: 'text' },
    iconState: { control: 'radio', options: ['iconLeft', 'iconRight', 'none'] },
    iconName: { control: 'text' },
  },
}

export const ParDefaut: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: '',
    size: 'medium',
    validationState: undefined,
    placeholder: 'Entrer du texte...',
    iconState: undefined,
    iconName: undefined,
  },
}

export const AvecIconeGauche: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: '',
    size: 'medium',
    iconState: 'iconLeft',
    iconName: undefined,
    placeholder: 'Rechercher...',
  },
}

export const AvecIconeDroite: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: '',
    size: 'medium',
    iconState: 'iconRight',
    iconName: 'Calendar',
    placeholder: 'Sélectionner une date...',
  },
}

export const AvecIconeSuppression: StoryObj<typeof BasicInput> = {
  args: {
    placeholder: 'Ecrivez puis supprimez',
    size: 'large',
    iconState: 'iconRight',
    deletable: true,
  },
}

export const EtatSucces: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: 'Message de succès',
    size: 'medium',
    validationState: 'success',
    placeholder: 'Validation réussie',
  },
}

export const EtatErreur: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: "Message d'erreur",
    size: 'small',
    validationState: 'error',
    placeholder: 'Erreur de validation',
  },
}

export const DesactiveAvecBadge: StoryObj<typeof BasicInput> = {
  args: {
    modelValue: '',
    size: 'medium',
  },
}

export default meta
