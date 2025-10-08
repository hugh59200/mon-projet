import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../designSystem/src/**/*.mdx', '../designSystem/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['./theme'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  docs: {},
}
export default config
