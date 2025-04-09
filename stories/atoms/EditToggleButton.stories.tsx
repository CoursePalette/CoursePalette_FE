import type { Meta, StoryObj } from '@storybook/react';

import EditToggleButton from '../../components/atoms/EditToggleButton';

const meta: Meta<typeof EditToggleButton> = {
  title: 'Atoms/EditToggleButton',
  component: EditToggleButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditToggleButton>;

export const Default: Story = {
  args: {},
};
