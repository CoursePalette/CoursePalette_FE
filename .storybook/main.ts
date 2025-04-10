import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (configOrig) => {
    configOrig.resolve = configOrig.resolve || {};
    configOrig.resolve.alias = {
      ...(configOrig.resolve.alias || {}),
      'next/navigation': path.resolve(
        process.cwd(),
        '__mocks__/next/navigation.ts'
      ),
    };
    return configOrig;
  },
  staticDirs: ['../public'],
};
export default config;
