import FavoriteButton from '@/components/atoms/FavoriteButton';
import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';

const meta = {
  title: 'Atoms/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  argTypes: {
    courseId: { control: 'number', description: '대상 코스 ID' },
  },
  args: {
    courseId: 123,
  },
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <div className='w-[500px] h-[300px] flex items-center justify-center'>
          <div className='relative'>
            <Story />
          </div>
        </div>
      </SessionProvider>
    ),
  ],
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  name: '로그인 상태',
  args: {
    courseId: 456,
  },
  decorators: [
    (Story) => {
      const loggedInSession = {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          backendJwt: 'fake-jwt-token',
          userId: 1,
          nickname: '테스트유저',
          profileImageUrl: 'https://via.placeholder.com/30',
        },
        expires: 'some-future-date',
      };
      return (
        <SessionProvider session={loggedInSession}>
          <Story />
        </SessionProvider>
      );
    },
  ],
};
