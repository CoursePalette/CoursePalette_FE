import type { Meta, StoryObj } from '@storybook/react';

import CancelButton from '../../components/atoms/CancelButton';

const meta: Meta<typeof CancelButton> = {
  title: 'Atoms/CancelButton',
  component: CancelButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CancelButton>;

export const Default: Story = {
  args: {
    onClick: () => alert('취소 버튼 클릭됨'),
  },
};
