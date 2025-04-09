import type { Meta, StoryObj } from '@storybook/react';

import MenuBox from '../../components/atoms/MenuBox';

const meta: Meta<typeof MenuBox> = {
  title: 'Atoms/MenuBox',
  component: MenuBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuBox>;

export const Default: Story = {
  args: {
    text: '내가 등록한 코스',
    onClick: () => alert('내가 등록한 코스 MenuBox 클릭'),
  },
};
