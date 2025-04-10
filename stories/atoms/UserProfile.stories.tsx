import type { Meta, StoryObj } from '@storybook/react';

import UserProfile from '../../components/atoms/UserProfile';

const meta: Meta<typeof UserProfile> = {
  title: 'Atoms/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  args: {
    nickname: '홍길동',
    profileImageUrl: 'https://picsum.photos/36/36',
  },
};

export const NoProfileImage: Story = {
  args: {
    nickname: '홍길동',
    profileImageUrl: '',
  },
};
