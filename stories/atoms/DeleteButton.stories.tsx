import type { Meta, StoryObj } from '@storybook/react';

import DeleteButton from '../../components/atoms/DeleteButton';

const meta: Meta<typeof DeleteButton> = {
  title: 'Atoms/DeleteButton',
  component: DeleteButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeleteButton>;

export const Default: Story = {
  args: {
    onClick: () => alert('삭제 버튼 클릭'),
  },
};
