import type { Meta, StoryObj } from '@storybook/vue3'
import AlertInput from './BasicAlert.vue'
import { type AlertType } from './BasicAlert.types'

const meta: Meta<typeof AlertInput> = {
  title: 'Composants/Simple Alerte',
  component: AlertInput,
  argTypes: {
    alertType: { control: 'select', options: ['warning', 'danger', 'success', 'info'] as AlertType[] },
    alertLabel: { control: 'text' },
  },
}

export const WarningAlert: StoryObj<typeof AlertInput> = {
  args: {
    alertType: 'warning',
    alertLabel: 'This is a warning alert',
  },
}

export const DangerAlert: StoryObj<typeof AlertInput> = {
  args: {
    alertType: 'danger',
    alertLabel: 'This is a danger alert',
  },
}

export const SuccessAlert: StoryObj<typeof AlertInput> = {
  args: {
    alertType: 'success',
    alertLabel: 'This is a success alert',
  },
}

export const InfoAlert: StoryObj<typeof AlertInput> = {
  args: {
    alertType: 'info',
    alertLabel: 'This is an info alert',
  },
}

export default meta
