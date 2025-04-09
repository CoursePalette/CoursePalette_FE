import type { Meta, StoryObj } from '@storybook/react';

import TextInput from '../../components/atoms/TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Atoms/TextInput',
  component: TextInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    infoText: '텍스트를 입력해주세요.',
    placeholder: '예) 혼자서 성수동 즐기는 코스',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    infoText: '텍스트를 입력해주세요',
    placeholder: '예) 혼자서 성수동 즐기는 코스',
    value: '양재에서 데이트하는 코스',
  },
};
