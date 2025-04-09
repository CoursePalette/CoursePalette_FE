import type { Meta, StoryObj } from '@storybook/react';

import PlaceDetailButton from '../../components/atoms/PlaceDetailButton';

const meta: Meta<typeof PlaceDetailButton> = {
  title: 'Atoms/PlaceDetailButton',
  component: PlaceDetailButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PlaceDetailButton>;

export const Default: Story = {
  args: {
    placeUrl: 'http://place.map.kakao.com/1104225959',
  },
};
