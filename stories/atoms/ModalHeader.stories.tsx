import type { Meta, StoryObj } from '@storybook/react';

import ModalHeader from '../../components/atoms/ModalHeader';

const meta: Meta<typeof ModalHeader> = {
  title: 'Atoms/ModalHeader',
  component: ModalHeader,
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
type Story = StoryObj<typeof ModalHeader>;

export const Default: Story = {};
