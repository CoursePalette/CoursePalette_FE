import type { Meta, StoryObj } from '@storybook/react';

import CategorySelect from '../../components/atoms/CategorySelect';

const meta: Meta<typeof CategorySelect> = {
  title: 'Atoms/CategorySelect',
  component: CategorySelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategorySelect>;

export const Default: Story = {
  args: {
    infoText: '코스 카테고리를 선택해주세요.',
    placeholder: '카테고리를 선택해주세요.',
    category: '',
    setCategory: (cat: string) => alert(`선택된 카테고리: ${cat}`),
  },
};

export const SelectedCategory: Story = {
  args: {
    infoText: '코스 카테고리를 선택해주세요.',
    placeholder: '카테고리를 선택해주세요.',
    category: '친구들과',
    setCategory: (cat: string) => alert(`선택된 카테고리: ${cat}`),
  },
};
