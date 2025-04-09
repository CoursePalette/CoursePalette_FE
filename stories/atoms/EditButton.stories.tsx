import type { Meta, StoryObj } from '@storybook/react';

import EditButton from '../../components/atoms/EditButton';

const meta: Meta<typeof EditButton> = {
  title: 'Atoms/EditButton',
  component: EditButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditButton>;

export const Default: Story = {
  args: {
    onClick: () => alert('수정 버튼 클릭'),
  },
};
