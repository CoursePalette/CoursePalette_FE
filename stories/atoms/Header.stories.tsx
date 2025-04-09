import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';

import Header from '../../components/atoms/Header';

const meta: Meta<typeof Header> = {
  title: 'Atoms/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <div className='w-full h-[300px] bg-gray-50 relative'>
          <Story />
        </div>
      </SessionProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
};
