'use client';

import PulseLoader from 'react-spinners/PulseLoader';

export default function Loading() {
  return (
    <div className='w-full h-full flex items-center justify-center '>
      <PulseLoader
        color='#0064FF'
        loading={true}
        size={12}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
}
