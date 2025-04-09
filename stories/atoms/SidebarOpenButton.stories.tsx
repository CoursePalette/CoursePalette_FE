import type { Meta, StoryObj } from '@storybook/react';

import SidebarOpenButton from '../../components/atoms/SidebarOpenButton';

const meta: Meta<typeof SidebarOpenButton> = {
  title: 'Atoms/SidebarOpenButton',
  component: SidebarOpenButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-[500px] h-[300px] flex items-center justify-center'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarOpenButton>;

export const Default: Story = {
  args: {},
};
