import type { Meta, StoryObj } from '@storybook/react';

import CourseCreateButton from '../../components/atoms/CourseCreateButton';

const meta: Meta<typeof CourseCreateButton> = {
  title: 'Atoms/CourseCreateButton',
  component: CourseCreateButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-[500px] h-[300px] flex items-center justify-center'>
        <div className='relative'>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CourseCreateButton>;

export const Default: Story = {
  args: {},
};
