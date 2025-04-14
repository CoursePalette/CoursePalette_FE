import InfoModal from '@/components/atoms/InfoModal';
import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof InfoModal> = {
  title: 'Atoms/InfoModal',
  component: InfoModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfoModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
      setIsOpen(false);
    };

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '1000px',
          backgroundColor: '#f0f0f0',
        }}
      >
        {isOpen && <InfoModal onClose={handleClose} />}
      </div>
    );
  },
};
