import type { Meta, StoryObj } from '@storybook/react';

import Category from '../../components/atoms/Category';

const meta: Meta<typeof Category> = {
  title: 'Atoms/Category',
  component: Category,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Category>;

export const Default: Story = {
  args: {
    category: '혼자서',
    selected: false,
    setCategory: (cat: string) => alert(`카테고리: ${cat}`),
  },
};

export const Selected: Story = {
  args: {
    category: '데이트',
    selected: true,
    setCategory: (cat: string) => alert(`카테고리: ${cat}`),
  },
};
