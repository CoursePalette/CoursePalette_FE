import type { Meta, StoryObj } from '@storybook/react';

import PlaceSelect from '../../components/atoms/PlaceSelect';

const meta: Meta<typeof PlaceSelect> = {
  title: 'Atoms/PlaceSelect',
  component: PlaceSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PlaceSelect>;

export const Default: Story = {};
