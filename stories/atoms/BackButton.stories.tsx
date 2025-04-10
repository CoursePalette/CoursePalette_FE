import type { Meta, StoryObj } from '@storybook/react';

import BackButton from '../../components/atoms/BackButton';

const meta: Meta<typeof BackButton> = {
  title: 'Atoms/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-[500px] h-[300px] flex items-center justify-center'>
        <div className='relative'>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {},
};
