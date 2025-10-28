import type { Meta, StoryObj } from '@storybook/vue3'
import BasicInputNumber from './BasicInputNumber.vue'
import { inputSizes, inputValidationStates, type InputSize, type ValidationState } from '../input/BasicInput.types'

const meta: Meta<typeof BasicInputNumber> = {
  title: 'Composants/Champs de saisie numérique',
  component: BasicInputNumber,
  argTypes: {
    modelValue: { control: 'number' },
    size: {
      control: 'select',
      options: inputSizes as InputSize[],
    },
    validationState: {
      control: 'select',
      options: inputValidationStates as ValidationState[],
    },
    placeholder: { control: 'text' },
    iconState: { control: 'radio', options: ['iconLeft', 'iconRight', 'none'] },
    iconName: { control: 'text' },
    decimal: { control: 'number' },
    pourcentage: { control: 'boolean' },
    separateur: { control: 'boolean' },
  },
}

export const ParDefaut: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: null,
    size: 'medium',
    validationState: undefined,
    placeholder: 'Entrer un nombre...',
    iconState: undefined,
    iconName: undefined,
    decimal: 2,
    pourcentage: false,
    separateur: false,
  },
}

export const AvecIconeGauche: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: null,
    size: 'medium',
    iconState: 'iconLeft',
    iconName: undefined,
    placeholder: 'Rechercher...',
  },
}

export const AvecIconeDroite: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: null,
    size: 'medium',
    iconState: 'iconRight',
    iconName: 'Calendar',
    placeholder: 'Sélectionner une date...',
  },
}

export const EtatSucces: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: '123.45',
    size: 'medium',
    validationState: 'success',
    placeholder: 'Validation réussie',
  },
}

export const EtatErreur: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: '123.45',
    size: 'small',
    validationState: 'error',
    placeholder: 'Erreur de validation',
  },
}

export const DesactiveAvecBadge: StoryObj<typeof BasicInputNumber> = {
  args: {
    modelValue: null,
    size: 'medium',
  },
}

export default meta
