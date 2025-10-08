import type { Preview } from '@storybook/vue3'
import '../src/assets/Mont/Mont.less'
import ekkoTheme from './theme/ekkoTheme'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: ekkoTheme,
    },
    options: {
      brandTitle: 'EKKO',
    },
  },

  tags: ['autodocs'],
}

export default preview
