import type { Meta, StoryObj } from '@storybook/react';

import CustomPin from '../../components/atoms/CustomPin';

const meta: Meta<typeof CustomPin> = {
  title: 'Atoms/CustomPin',
  component: CustomPin,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='relative w-[300px] h-[200px] bg-gray-50 flex items-center justify-center'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CustomPin>;

export const Default: Story = {
  args: {
    title: '장소 이름',
    address: '장소 주소',
    route: '/place/1234',
    id: 'pin-1',
  },
};

export const LongText: Story = {
  args: {
    title: '매우매우 긴 장소 장소 이름',
    address: '매우매우 긴 장소 장소 주소',
    route: '/place/1234',
    id: 'pin-1',
  },
};
