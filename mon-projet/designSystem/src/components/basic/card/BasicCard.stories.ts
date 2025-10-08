import type { Meta, StoryObj } from '@storybook/vue3'
import BasicCard from './BasicCard.vue'
import picture from '@/assets/mediaCardExemples/exemple_1.webp'

export default {
  title: 'Composants/Card',
  component: BasicCard,
} as Meta<typeof BasicCard>

type Story = StoryObj<typeof BasicCard>

const Template: Story = {
  render: (args) => ({
    components: { BasicCard },
    setup() {
      return { args }
    },
    template: '<BasicCard v-bind="args" />',
  }),
}

export const AvatarImage: Story = {
  ...Template,
  args: {
    avatar: {
      type: 'media',
      imageUrl: picture,
    } as any,
    title: 'Maëva Furiani',
    subtitles: [
      { text: 'Assistante Emploi Formation' },
      { text: 'maeva.furiani@akto.fr', icon: 'email-tracking' },
      { text: '06 71 13 79 70', icon: 'call-calling' },
    ] as any,
    deletable: true,
  },
}

export const AvatarImageWithBadge: Story = {
  ...Template,
  args: {
    avatar: {
      type: 'media',
      imageUrl: picture,
    } as any,
    title: 'Maëva Furiani',
    subtitles: [
      { text: 'Assistante Emploi Formation' },
      { text: 'maeva.furiani@akto.fr', icon: 'email-tracking' },
      { text: '06 71 13 79 70', icon: 'call-calling' },
    ] as any,
    badge: {
      label: 'Default',
      type: 'default',
      deletable: false,
      size: 'medium',
    } as any,
    deletable: true,
  },
}

export const SansAvatar: Story = {
  ...Template,
  args: {
    avatar: undefined,
    title: 'Maëva Furiani',
    subtitles: [
      { text: 'Assistante Emploi Formation' },
      { text: 'maeva.furiani@akto.fr', icon: 'email-tracking' },
    ] as any,
    deletable: true,
  },
}

export const NomAvatar: Story = {
  ...Template,
  args: {
    ...AvatarImage.args,
    avatar: {
      type: 'name',
      name: 'Maëva Furiani',
    } as any,
  },
}

export const IconeAvatar: Story = {
  ...Template,
  args: {
    ...AvatarImage.args,
    avatar: {
      type: 'icon',
      iconName: 'bank',
    } as any,
  },
}
