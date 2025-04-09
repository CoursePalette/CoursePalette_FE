import type { Meta, StoryObj } from '@storybook/react';

import RegisterButton from '../../components/atoms/RegisterButton';

const meta: Meta<typeof RegisterButton> = {
  title: 'Atoms/RegisterButton',
  component: RegisterButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RegisterButton>;

export const Default: Story = {
  args: {
    disabled: false,
    onClick: () => alert('등록 버튼 클릭'),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: () => alert('등록 버튼 클릭'),
  },
};
