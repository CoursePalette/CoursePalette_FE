import ProfileImageInput from '@/components/atoms/ProfileImageInput';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProfileImageInput> = {
  title: 'Atoms/ProfileImageInput',
  component: ProfileImageInput,
  tags: ['autodocs'],
  argTypes: {
    onFileChange: { action: '파일 변경' },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileImageInput>;

// 스토리 예시
export const Default: Story = {
  args: {
    profileImg: 'https://picsum.photos/150/150',
  },
};

export const EmptyProfile: Story = {
  args: {
    profileImg: '',
  },
};
